import { Alert } from 'react-native';
import { supabase } from '../service/supabase';

export async function signup({ email, password, name, phone}) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
        data: {
            name,
            phone
        },
        },
    });
    if (error) Alert.alert(error.message);
 
    return data;
}
