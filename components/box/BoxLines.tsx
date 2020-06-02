import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import boxStyles from '../../constants/boxStyles'

const BoxLines: React.FC<{
    boxIndex: number
}> = ({ boxIndex }) => {
    return (
        <React.Fragment>
            {/* horizontal and verticle lines for the grid */}
            {
                /* for connecting different boxes */

                boxIndex != 2 ? (
                    <>
                        <View style={{
                            ...styles.boxConnector,
                            ...styles.verticleStyles,
                            top: '0%',
                            height: boxIndex == 0 ? '11%' : '14%',
                           
                        }}>
                          
                        </View>
                        <View style={{
                            ...styles.boxConnector,
                            ...styles.verticleStyles,
                            bottom: '0%',
                            height: boxIndex == 0 ? '11%' : '14%'
                        }}>
                            
                        </View>
                        <View style={{
                            ...styles.boxConnector,
                            ...styles.horizontalStyles,
                            left: '0%',
                            width: boxIndex == 0 ? '8%' : '12%',
                            marginLeft:  boxIndex == 0 ? boxStyles.width / 2 + 2: boxStyles.width / 2
                        }}>
                           
                        </View>
                        <View style={{
                            ...styles.boxConnector,
                            ...styles.horizontalStyles,
                            right: '0%',
                            width: boxIndex == 0 ? '8%' : '12%',
                            marginRight:  boxIndex == 0 ? boxStyles.width / 2 + 2: boxStyles.width / 2
                        }}>
                           
                        </View>
                    </>
                ) : null
            }

            <>
                {/* left line */}
                <View
                    style={{
                        ...styles.lineInfo,
                        height: '100%',
                        left: 0,
                        marginLeft: boxStyles.width / 2
                    }}>
                </View>
                {/* right line */}
                <View
                    style={{
                        ...styles.lineInfo,
                        height: '100%',
                        right: 0,
                        marginRight: boxStyles.width / 2
                    }}>
                </View>
                {/* bottom line */}
                <View
                    style={{
                        ...styles.lineInfo,
                        width: '100%',
                        bottom: 0,
                        marginBottom: boxStyles.height / 2
                    }}>
                </View>
                {/* top line */}
                <View
                    style={{
                        ...styles.lineInfo,
                        width: '100%',
                        top: 0,
                        marginTop: boxStyles.height / 2
                    }}>
                </View>
            </>

        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    boxConnector: {
        position: 'absolute',
        backgroundColor: 'white',
        zIndex: -2
    },
    verticleStyles: {
        width: 1,
        borderWidth: 1,
        borderColor: '#807c7f',
        height: '10%',
        position: 'absolute',
        zIndex: -2
    },
    horizontalStyles: {
        width: '13%',
        top: '50%',
        marginTop: boxStyles.height / 2,
        marginLeft: boxStyles.width / 2,
        height: 1,
        borderWidth: 1,
        borderColor: '#807c7f',
        zIndex: -2,
        position: 'absolute'
    },
    lineInfo: {
        position: 'absolute',
        borderColor: '#807c7f',
        borderWidth: 1,
        zIndex: -2
    }
})

export default BoxLines
