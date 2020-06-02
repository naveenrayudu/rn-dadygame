import React, { useRef, useEffect, useCallback, useMemo } from 'react'
import { View, Text, StyleSheet, TouchableHighlight, Alert, Animated, Easing } from 'react-native'
import boxStyles from '../../constants/boxStyles'
import { useSelector, useDispatch } from 'react-redux';
import { IStoreModel, GameActionType } from '../../models/gameState';
import { IDefaultAction } from '../../models/reduxModel';
import { Dispatch } from 'redux';
import MovablePawn from './MovablePawn';
import { insertPlayerPawn, movePlayerPawn, removePlayerPawns } from '../../store/actions/game';
import gameProps from '../../helpers/gamePositions';
import RotatingView from '../animated/RotatingView';


interface IProps {
    containerIndex: number,
    setEleOnMove: (isOnMove: number) => void,
    eleOnMove: number
}

const PawnContainer: React.FC<IProps> = ({ containerIndex, setEleOnMove, eleOnMove }) => {
    const { pawnPosition, playerId, pawnContents, actionType, isCurrentPlayerPawn, pawnsToRemove } = useSelector((state: IStoreModel) => {
        return {
            pawnPosition: state.pawnElementsPosition[containerIndex] || {},
            pawnContents: state.game.pawnContent,
            playerId: state.game.playerId,
            actionType: state.game.gameActionType,
            isCurrentPlayerPawn: !!(state.game.gamePositions[state.game.playerId] && state.game.gamePositions[state.game.playerId][containerIndex] !== undefined),
            pawnsToRemove: state.game.pawnsToRemove
        }
    });

    const content = pawnContents[containerIndex];

    const validMovesFromContainer = useMemo(() => {
        const validMoves = gameProps.validMoves[containerIndex];
        return validMoves.filter(t => !pawnContents[t]);
    }, [pawnContents, containerIndex]);

    const ref = useRef<TouchableHighlight>(null);

    const dispatch = useDispatch<Dispatch<IDefaultAction<any>>>();

    const canBeDeleted = !!content && !isCurrentPlayerPawn
        && pawnsToRemove.indexOf(containerIndex) !== -1
        && actionType === GameActionType.Remove;

    const canBeInserted = !content && actionType === GameActionType.Insert;

    const canBeMoved = actionType === GameActionType.Move
        && !!content
        && isCurrentPlayerPawn;

    const onPress = useCallback(() => {
        if (canBeInserted) {
            insertPlayerPawn(playerId, containerIndex);
        }

        if (canBeDeleted) {
            removePlayerPawns(playerId, containerIndex);
        }
    }, [containerIndex, playerId, content, actionType]);

    const onMove = useCallback((moveFrom: number, moveTo: number) => {
        // Continue
        if (actionType === GameActionType.Move && validMovesFromContainer.indexOf(moveTo) !== -1) {
            movePlayerPawn(playerId, moveFrom, moveTo);
        }
    }, [containerIndex, playerId, actionType]);

    useEffect(() => {
        if (ref.current) {
            ref.current.measureInWindow((x, y, width, height) => {
                dispatch({
                    type: "SET_PAWN_ELEMENT_POSITION",
                    payload: {
                        x: x,
                        y: y,
                        containerIndex: containerIndex
                    }
                })
            })
        }
    }, [dispatch, ref, ref.current]);

    const showAnimation = canBeInserted || canBeMoved || canBeDeleted;

    return (
        <View
            ref={ref}
            style={{
                ...styles.pawnContainer,
                zIndex: containerIndex == eleOnMove ? 50 : 0,
                elevation: containerIndex == eleOnMove ? 5 : 0,
                position: 'relative',
                borderWidth: showAnimation ? 0: 1
            }}>
            <RotatingView showAnimation={showAnimation}>
                {canBeMoved ? (
                    <MovablePawn content={content}
                        onMoveSuccess={onMove}
                        validMoves={validMovesFromContainer}
                        pawnPosition={pawnPosition}
                        containerIndex={containerIndex}
                        setEleOnMove={setEleOnMove}
                        eleOnMove={eleOnMove} />
                ) : (
                        <TouchableHighlight
                            ref={ref}
                            underlayColor='green'
                            disabled={!(canBeDeleted || canBeInserted)}
                            style={{
                                ...styles.pawnContent,
                                backgroundColor: canBeDeleted ? 'red' : 'white'
                            }}
                            onPress={onPress} >

                            <View style={{
                                ...styles.textContent
                            }}>
                                <Text style={{color: canBeDeleted ? 'white': 'black'}}>{content}</Text>
                            </View>
                        </TouchableHighlight>)}
            </RotatingView>
        </View>
    );
}


const styles = StyleSheet.create({
    pawnContainer: {
        width: boxStyles.width,
        height: boxStyles.height,
        borderRadius: 50,
        borderColor: 'black',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pawnContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexGrow: 1,
        width: '100%',
        height: '100%',
        borderRadius: 50,
        borderColor: 'black',
    },
    textContent: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default PawnContainer
