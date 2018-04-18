clean-build:
	react-native unlink realm && react-native unlink react-native-sensors && watchman watch-del-all && rm -rf node_modules/

i-dep:
	npm i && install-local ../../forks/react-native-sensors/ && react-native link realm && react-native link react-native-sensors && react-native link react-native-keep-awake
