import React from 'react';
import { WebView } from 'react-native-webview';
import { RouteProp, useRoute } from '@react-navigation/native';

type VNPayScreenRouteProp = RouteProp<{ params: { vnpayUrl: string } }, 'params'>;

const VNPayScreen: React.FC = () => {
  const route = useRoute<VNPayScreenRouteProp>();
  const { vnpayUrl } = route.params;

  return (
    <WebView source={{ uri: vnpayUrl }} />
  );
};

export default VNPayScreen;
