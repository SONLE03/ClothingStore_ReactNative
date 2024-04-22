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
    if (error) return false;
 
    return true;
}

export async function signin({email, password}){
    let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    if (error) return false;
    return true;
}
