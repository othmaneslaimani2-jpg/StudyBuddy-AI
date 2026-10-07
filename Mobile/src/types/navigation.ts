import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  AIChat: undefined;
  UploadNote: undefined;
  Tasks: undefined;
  Notes: undefined;
  Profile: undefined;
};

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;
export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type UploadNoteScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UploadNote'>;
export type AIChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AIChat'>;
export type TasksScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tasks'>;
export type NotesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Notes'>;
export type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;
