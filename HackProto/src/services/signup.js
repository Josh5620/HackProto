import { supabaseClient } from "./supabaseClient";

async function signUp(newStudent) {
    const { data, error } = await supabaseClient 
    .from("users")
    .insert([
        {
            full_name: newStudent.full_name,
            subjects: newStudent.subjects,
            availability: newStudent.availability,
            preferred_lang: newStudent.preferred_lang,
            school: newStudent.school,
            special: newStudent.special
        }
    ])
    .select();
    if (error) console.error(error);
    else console.log("Inserted new user: ", data[0]);
}




export { signUp };