import React, { useRef, useState } from 'react'
import { View, Text, PanResponder, Animated, StyleSheet, ViewPagerAndroidComponent } from 'react-native'
import boxStyles from '../../constants/boxStyles';
import { useSelector } from 'react-redux';
import { IStoreModel } from '../../models/gameState';


interface IProps {
    pawnPosition: {
        x: number;
        y: number;
    },
    containerIndex: number,
    setEleOnMove: (isOnMove: number) => void,
    eleOnMove: number,
    content: string | undefined,
    validMoves: number[],
    onMoveSuccess: (moveFrom: number, moveTo: number) => void
}

const MovablePawn: React.FC<IProps> = ({pawnPosition, containerIndex, setEleOnMove, validMoves, content, onMoveSuccess}) => {
   
    const validDropPositions =  useSelector((state: IStoreModel) => validMoves.map((validContainerIndex) => {
        return state.pawnElementsPosition[validContainerIndex]
    }));

    const pan = useRef(new Animated.ValueXY).current;
    const [isCurrentEleOnMove, setCurrentEleOnMove] = useState(false);
   
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: () => {
                setEleOnMove(containerIndex);
                setCurrentEleOnMove(true);
            },
            onPanResponderEnd: () => {
                setEleOnMove(-1);
                setCurrentEleOnMove(false);
            },
            onPanResponderMove: Animated.event(
                [
                    null,
                    { dx: pan.x, dy: pan.y }
                ]
            )
        })
    ).current;

    panResponder.panHandlers.onResponderRelease = () => {
        const positionToMatch =  validDropPositions.find((t) =>  {
            const panXValue = (pan.x as any)._value + pawnPosition.x;
            const panYValue = (pan.y as any)._value + pawnPosition.y;

            const isXMatched =  panXValue <= t.x + (boxStyles.width) &&
                                panXValue >= t.x - (boxStyles.width);

            const isYMatched = panYValue <= t.y + (boxStyles.height) &&
                                panYValue >= t.y - (boxStyles.height);

            return isXMatched && isYMatched;
        })

        if(!positionToMatch) {
            pan.setValue({x: 0, y: 0});
        } else {
            onMoveSuccess(containerIndex, positionToMatch.pawnId);
            pan.flattenOffset();
        }
    }
 
    return (
        <View  style={{
            zIndex: isCurrentEleOnMove ? 9999 : 0,
            elevation: isCurrentEleOnMove ? 6: 0,
            position: 'relative'
        }}>
            <Animated.View
                collapsable={false}
                style={{
                    transform: [{ translateX: pan.x }, { translateY: pan.y }],
                    ...styles.panMover,
                    ...Object.assign({}, isCurrentEleOnMove ? styles.onMove: {})
                }}
                {...panResponder.panHandlers}
            >
               {
                   content ? <Text>{content}</Text> : null
               } 
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    panMover: {
        width: boxStyles.width,
        height: boxStyles.height,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderColor: 'grey'
    },
    onMove: {
        position: 'absolute',
        top: -boxStyles.height / 2,
        left: -boxStyles.width / 2,
        backgroundColor: 'green',
        elevation: 5,
        zIndex: 99
    }
})

export default MovablePawn;
