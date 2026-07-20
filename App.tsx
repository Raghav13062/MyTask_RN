import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PaperProvider } from 'react-native-paper';
import { store, persistor } from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';
import { seedDemoData } from './src/database/seeder';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  useEffect(() => {
    
     seedDemoData().catch(console.error);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <SafeAreaProvider>
            <RootNavigator />
          </SafeAreaProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
