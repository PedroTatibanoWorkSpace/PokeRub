import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  smallButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 182, 193, 0.9)',
    borderColor: 'rgba(255, 105, 135, 0.3)',
  },
  icon: {
    fontSize: 18,
  },
  smallIcon: {
    fontSize: 14,
  },
});