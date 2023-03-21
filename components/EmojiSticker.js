import { View, Image } from 'react-native'
import { TapGestureHandler } from 'react-native-gesture-handler'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useAnimatedGestureHandler,
    withSpring,
} from 'react-native-reanimated'

// https://github.com/software-mansion/react-native-reanimated/issues/3355
window._frameTimestamp = null

const AnimatedImage = Animated.createAnimatedComponent(Image)

export default function EmojiSticker({ imageSize, stickerSource }) {

    const scaleImage = useSharedValue(imageSize)

    const onDoubleTap = useAnimatedGestureHandler({
        onActive: (event) => {
            console.log({event})
            if (scaleImage.value) {
                scaleImage.value = scaleImage.value * 2
            }
        }
    })

    const imageStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(scaleImage.value),
            height: withSpring(scaleImage.value),
        }
    })

    return (
        <View style={{ top: -350 }}>
            <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
                <AnimatedImage
                    source={stickerSource}
                    resizeMode='contain'
                    style={[imageStyle, { width: imageSize, height: imageSize }]}
                />
            </TapGestureHandler>
        </View>
    )
}