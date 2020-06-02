import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import boxStyles from '../../constants/boxStyles'
import PawnContainer from '../pawn/PawnContainer';
import BoxLines from './BoxLines';

interface IProps {
    boxIndex: number
}

const Box: React.FC<IProps> = ({ boxIndex }) => {
    const [eleOnMove, setEleOnMove] = useState(-1);
    const setOnMoveCallBack = useCallback((isOnMove: number) => {
        setEleOnMove(isOnMove)
    }, [setEleOnMove])

   const boxNumber = Math.floor(eleOnMove / 8);
   const elementPos = eleOnMove % 8;

    return (
        <React.Fragment>
            <View style={{ ...styles.box, zIndex: eleOnMove > -1 ? 999 : 0, elevation: eleOnMove > -1 ? 5 : 0, height: `${90 - boxIndex * 20}%`, width: `${95 - boxIndex * 27}%` }}>

                <BoxLines boxIndex={boxIndex} />

                <View style={{ ...styles.line,
                             ...styles.topLine, 
                             ...Object.assign({}, elementPos < 3 && elementPos > -1 ? styles.selectedEle : {})
                             }}>

                    <View style={Object.assign({}, elementPos == 0 ? styles.selectedEle : {})}>
                        <PawnContainer containerIndex={boxIndex * 8 + 0} eleOnMove={eleOnMove} setEleOnMove={setOnMoveCallBack} />
                    </View>

                    <View style={Object.assign({}, elementPos == 1 ? styles.selectedEle : {})}>
                        <PawnContainer containerIndex={boxIndex * 8 + 1} eleOnMove={eleOnMove} setEleOnMove={setOnMoveCallBack} />
                    </View>
                    <View style={{
                        ...styles.rightLine, 
                        ...Object.assign({}, elementPos == 2 ? styles.selectedEle : {})
                    }}>
                        <PawnContainer containerIndex={boxIndex * 8 + 2} eleOnMove={eleOnMove} setEleOnMove={setOnMoveCallBack} />
                    </View>
                </View>

                <View style={{ ...styles.line,
                         ...styles.midLine,
                         ...Object.assign({}, elementPos < 5 && elementPos > 2 ? styles.selectedEle : {})
                          }} >
                    <View  style={Object.assign({}, elementPos == 3 ? styles.selectedEle : {})}>
                        <PawnContainer containerIndex={boxIndex * 8 + 3} eleOnMove={eleOnMove} setEleOnMove={setOnMoveCallBack} />
                    </View>
                    <View style={{
                        ...styles.rightLine,
                        ...Object.assign({}, elementPos == 4 ? styles.selectedEle : {})
                    }}>
                        <PawnContainer containerIndex={boxIndex * 8 + 4} eleOnMove={eleOnMove} setEleOnMove={setOnMoveCallBack} />
                    </View>
                </View>

                <View style={{ 
                                                    ...styles.line, 
                                                    ...styles.bottomLine
                                                }}>
                    <View  style={Object.assign({}, elementPos == 5 ? styles.selectedEle : {})}>
                        <PawnContainer containerIndex={boxIndex * 8 + 5} eleOnMove={eleOnMove} setEleOnMove={setOnMoveCallBack} />
                    </View>
                    <View style={Object.assign({}, elementPos == 6 ? styles.selectedEle : {})}>
                        <PawnContainer containerIndex={boxIndex * 8 + 6} eleOnMove={eleOnMove} setEleOnMove={setOnMoveCallBack} />
                    </View>
                    <View style={styles.rightLine}>
                        <PawnContainer containerIndex={boxIndex * 8 + 7} eleOnMove={eleOnMove} setEleOnMove={setOnMoveCallBack} />
                    </View>
                </View>
            </View>
        </React.Fragment>

    )
}

const styles = StyleSheet.create({
    box: {
        position: 'absolute',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
        zIndex: -2
    },
    line: {
        position: 'absolute',
        flexDirection: 'row',
        flex: 1,
        zIndex: -2,
        width: '100%',
        justifyContent: 'space-between'
    },
    topLine: {
        top: '0%'
    },
    midLine: {
        top: '50%'
    },
    rightLine: {
        right: '0%'
    },
    bottomLine: {
        bottom: '0%'
    },
    leftLine: {
        left: '0%'
    },
    selectedEle: {
        zIndex: 60,
        elevation: 3
    }
})

export default Box
