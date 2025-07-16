import Friend from "../classes/Friend";

export const lastContactFirst = ((a: Friend, b: Friend): number => {

    const aHasContacts = a.contacts.length > 0;
    const bHasContacts = b.contacts.length > 0;
    
    if (!aHasContacts && !bHasContacts) return 0; // Both have no contacts -> keep original order
    if (!aHasContacts) return -1; // a has no contacts -> a comes first
    if (!bHasContacts) return 1; // b has no contacts -> b comes first
    
    // Both have contacts -> compare by last contact date
    const aLastContact = new Date(a.contacts[a.contacts.length - 1]);
    const bLastContact = new Date(b.contacts[b.contacts.length - 1]);
    
    return aLastContact.getTime() - bLastContact.getTime(); 
    // earlier dates come first 

});

export const recentContactFirst = ((a: Friend, b: Friend): number => {

    const aHasContacts = a.contacts.length > 0;
    const bHasContacts = b.contacts.length > 0;
    
    if (!aHasContacts && !bHasContacts) return 0; // Both have no contacts -> keep original order
    if (!aHasContacts) return 1; // a has no contacts -> b comes first
    if (!bHasContacts) return -1; // b has no contacts -> a comes first
    
    // Both have contacts -> compare by last contact date
    const aLastContact = new Date(a.contacts[a.contacts.length - 1]);
    const bLastContact = new Date(b.contacts[b.contacts.length - 1]);
    
    return bLastContact.getTime() - aLastContact.getTime(); 
    // later dates come first 

});

export const leastContactedFirst = ((a: Friend, b: Friend): number => {
    
    return a.contacts.length - b.contacts.length;  
    
});
    
export const mostContactedFirst = ((a: Friend, b: Friend): number => {

    return b.contacts.length - a.contacts.length;
    
});