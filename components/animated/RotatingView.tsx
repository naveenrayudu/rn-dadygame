import React, { useState } from 'react'
import { Animated, View, StyleSheet, Easing } from 'react-native'

interface IProps {
    showAnimation?: boolean
}


const RotatingView: React.FC<IProps> = ({ showAnimation = true, children }) => {
    const [rotate] = useState(new Animated.Value(0));
    React.useEffect(() => {
        Animated.loop(Animated.timing(rotate, {
            toValue: 360,
            duration: 10000,
            easing: Easing.linear
        })).start();
    }, [showAnimation]);


    return (
        <React.Fragment>
            {
                showAnimation ? (
                    <Animated.View style={{
                        ...styles.defaultStyles,
                        ...styles.animatedStyles,
                        borderColor: 'red',
                        borderWidth: rotate.interpolate({
                                            inputRange: [0, 90, 180, 270, 360],
                                            outputRange: [2 , 3, 2, 3, 2],
                                        }),
                    }}>
                        {children}
                    </Animated.View>)
                    :
                    (<View style={styles.defaultStyles}>
                        {children}
                    </View>)
            }
        </React.Fragment>
    )
}


const styles = StyleSheet.create({
    defaultStyles: {
        flex: 1,
        flexGrow: 1,
        width: '100%',
        height: '100%',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    animatedStyles: {
        borderStyle: 'dotted'
    }
})

export default RotatingView
