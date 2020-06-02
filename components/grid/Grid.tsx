import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, Text, Button } from 'react-native'
import Box from '../box/Box'
import { useDispatch, useSelector } from 'react-redux'
import { IDefaultAction } from '../../models/reduxModel'
import { Dispatch } from 'redux'
import IActionTypes from '../../store/actions/types'
import { startGame } from '../../store/actions/game'
import {  IStoreModel, GameStatus } from '../../models/gameState'

const Grid = () => {

    const dispatch = useDispatch<Dispatch<IDefaultAction<any>>>();
    const {gameStatus, wonBy, playerId} = useSelector((state: IStoreModel) => {
        return {
            gameStatus: state.game.gameStatus,
            wonBy: state.game.wonBy,
            playerId: state.game.playerId
        }
    })

    const onRestartGame = useCallback(() => {
        dispatch(startGame())
    }, [dispatch])

    useEffect(() => {
        dispatch(startGame())
    },[dispatch]);
  
    return (
        <View style={styles.gridWrapper}>  
            <View style={styles.gridContainer}>
                {
                    Array.from({ length: 3 }, (v, i) => <Box boxIndex={i} key={i} />)
                }
            </View>

            <View style={{
                height: '10%'
            }}>

            </View>



          {
              gameStatus === GameStatus.Completed ?(
                  <View style={{
                      position: 'absolute',
                      flex: 1,
                      flexGrow: 1,
                      width: '100%',
                      height: '100%',
                      opacity: 0.9,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'white'
                  }}>
                      {
                        wonBy === playerId ?
                         (<Text>Congratulations, you won the game</Text>)
                          : (<Text>Sorry, you lost the game</Text>)
                      }
                     
                      <Button title="Ok!!" onPress={onRestartGame}/>
                  </View>
              )
               :null
          }
        </View>

    )
}

const styles = StyleSheet.create({
    gridWrapper: {
        flexGrow: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#f28dc6'
    },
    gridContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        width: '90%',
        height: '90%'
    }
})

export default Grid
