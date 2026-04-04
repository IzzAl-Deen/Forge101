import { Platform } from "react-native";

const tintColorLight = "#b8ff1a";
const tintColorDark = "#b8ff1a";

export const Colors = {
	light: {
		text: "#11181C",
		background: "#fff",
		tint: tintColorLight,
		icon: "#687076",
		tabIconDefault: "#687076",
		tabIconSelected: tintColorLight,
	},
	dark: {
		text: "#ffffff",
		background: "#0a0a0a",
		tint: tintColorDark,
		icon: "#9BA1A6",
		tabIconDefault: "#9BA1A6",
		tabIconSelected: tintColorDark,
	},
};

export const Kinetic = {
	accentPrimary: "#b8ff1a",
	accentLight: "#e7ff9d",
	accentGlow: "#d6ff7a",
	white: "#ffffff",
	textMuted: "rgba(255,255,255,0.65)",
	textFaint: "rgba(255,255,255,0.35)",
	inputBg: "rgba(255,255,255,0.05)",
	inputBorder: "rgba(255,255,255,0.05)",
	cardBg: "rgba(10,10,10,0.65)",
	cardSecondary: "rgba(255,255,255,0.04)",
	cardBorder: "rgba(255,255,255,0.06)",
	outlineBorder: "rgba(255,255,255,0.12)",
	overlayBg: "rgba(0,0,0,0.6)",
	divider: "rgba(255,255,255,0.05)",
	dark: "#1a1a1a",
	error: "#ff4d4d",
};

export const Spacing = {
	xs: 6,
	sm: 12,
	md: 20,
	lg: 26,
	xl: 32,
	xxl: 40,
};

export const Fonts = Platform.select({
	ios: {
		sans: "system-ui",
		serif: "ui-serif",
		rounded: "ui-rounded",
		mono: "ui-monospace",
	},
	default: {
		sans: "normal",
		serif: "serif",
		rounded: "normal",
		mono: "monospace",
	},
	web: {
		sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
		serif: "Georgia, 'Times New Roman', serif",
		rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
		mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
	},
});
