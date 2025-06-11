// components/chat/ChatBox.tsx
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ChatMessage, ChatService} from '../service/chat-service';

interface ChatBoxProps {
  isVisible: boolean;
  onClose: () => void;
}

const {width, height} = Dimensions.get('window');

const ChatBox: React.FC<ChatBoxProps> = ({isVisible, onClose}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  console.log('messages', messages);

  useEffect(() => {
    if (isVisible) {
      loadChatHistory();
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const loadChatHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('furniture_chat_history');
      console.log('history', history);
      if (history) {
        const parsedMessages = JSON.parse(history);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((message: any) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        }));
        setMessages(messagesWithDates);
      } else {
        // Add welcome message
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          text: "Hi! I'm your furniture store assistant. I'm here to help you with product information, sizing, care instructions, and more. How can I assist you today?",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Hi! I'm your furniture store assistant. I'm here to help you with product information, sizing, care instructions, and more. How can I assist you today?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  };

  const saveChatHistory = async (newMessages: ChatMessage[]) => {
    try {
      await AsyncStorage.setItem(
        'furniture_chat_history',
        JSON.stringify(newMessages),
      );
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await ChatService.sendMessage(inputText.trim());

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact our customer service directly.",
        isUser: false,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('furniture_chat_history');
      // Reset to welcome message
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Hi! I'm your furniture store assistant. I'm here to help you with product information, sizing, care instructions, and more. How can I assist you today?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  const formatTimestamp = (timestamp: Date | string | undefined) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      // Check if date is valid
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  const renderMessage = (message: ChatMessage) => (
    <View
      key={message.id}
      className={`mb-4 ${message.isUser ? 'items-end' : 'items-start'}`}>
      <View
        className={`max-w-[80%] p-3 rounded-2xl ${
          message.isUser
            ? 'bg-orange-500 rounded-tr-sm'
            : 'bg-gray-200 rounded-tl-sm'
        }`}>
        <Text
          className={`text-sm ${
            message?.isUser ? 'text-white' : 'text-gray-800'
          }`}>
          {message?.text}
        </Text>
      </View>
      <Text className="text-xs text-gray-500 mt-1 px-2">
        {formatTimestamp(message?.timestamp)}
      </Text>
    </View>
  );

  if (!isVisible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 80,
        zIndex: 500,
        opacity: opacityAnim,
      }}>
      <TouchableOpacity
        className="flex-1 bg-black bg-opacity-50"
        onPress={onClose}
        activeOpacity={1}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
          <Animated.View
            style={{
              transform: [{translateY: slideAnim}],
              height: height * 0.7,
            }}
            className="absolute bottom-0 left-4 right-4 bg-white rounded-t-3xl shadow-2xl">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full items-center justify-center mr-3">
                  <MaterialCommunityIcons
                    name="robot"
                    size={20}
                    color="white"
                  />
                </View>
                <View>
                  <Text className="text-lg font-bold text-gray-800">
                    Furniture Assistant
                  </Text>
                  <Text className="text-xs text-green-500">● Online</Text>
                </View>
              </View>
              <View className="flex-row">
                <TouchableOpacity onPress={clearHistory} className="mr-3 p-2">
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} className="p-2">
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollViewRef}
              className="flex-1 p-4"
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({animated: true})
              }>
              {messages.map(renderMessage)}
              {isLoading && (
                <View className="items-start mb-4">
                  <View className="bg-gray-200 p-3 rounded-2xl rounded-tl-sm">
                    <View className="flex-row items-center">
                      <Text className="text-gray-500 mr-2">Typing</Text>
                      <View className="flex-row">
                        <View className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-pulse" />
                        <View className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-pulse" />
                        <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <View className="flex-row items-center p-4 border-t border-gray-200">
              <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2 mr-3">
                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Ask about furniture, sizing, care..."
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-gray-800"
                  multiline
                  maxLength={500}
                />
                <Text className="text-xs text-gray-400 ml-2">
                  {inputText.length}/500
                </Text>
              </View>
              <TouchableOpacity
                onPress={sendMessage}
                disabled={!inputText.trim() || isLoading}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  inputText.trim() && !isLoading
                    ? 'bg-orange-500'
                    : 'bg-gray-300'
                }`}>
                <MaterialCommunityIcons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ChatBox;