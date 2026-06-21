import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../assets/constants/colors';

const { width, height } = Dimensions.get('window');

export const launchStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: '#e8f4fd',
    top: -width * 0.5,
    right: -width * 0.4,
    opacity: 0.6,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#deeefa',
    bottom: -width * 0.2,
    left: -width * 0.2,
    opacity: 0.5,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 52,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: -1,
  },
  logoPart: {
    color: colors.primary,
  },
  tripWrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  logoTrip: {
    color: colors.primaryDark,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 40,
    backgroundColor: 'rgba(255,255,255,0.38)',
    transform: [{ skewX: '-20deg' }],
  },
  slogan: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#2c5f8a',
    letterSpacing: 0.5,
  },
  tagline: {
    marginTop: 8,
    fontSize: 14,
    color: '#7aadce',
    letterSpacing: 1.2,
    fontWeight: '400',
  },
  dotsRow: {
    position: 'absolute',
    bottom: height * 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
