import { supabaseClient } from "./supabaseClient";

async function getUsers() {
    const { data, error } = await supabaseClient
        .from('users')
        .select('*')

    if (error) console.error(error);
    else console.log(data);
}

export { getUsers };

