import Friend from "../classes/Friend"

export type NotificationMessage = {
    title: string,
    body: string
}

export enum NotificationType {
    ThirtyDayReminder = 'thirtyDayReminder',
    Hangout = 'hangoutSuggestion',
    // Add more as needed
}

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const NotificationMessages = {

    thirtyDayReminder: (friend: Friend): NotificationMessage[] => [
        {
            title: "Reach out to a friend",
            body: `It's been a month since you contacted ${friend.name.firstName}.`,
        },
        {
            title: "Shoot them a text",
            body: `I wonder what ${friend.name.firstName} has been up to lately...`,
        },
        {
            title: "Time flies!",
            body: `It’s already been 30 days since you last reached out to ${friend.name.firstName}.`,
        },
        {
            title: "Reconnect and uplift",
            body: `A message to ${friend.name.firstName} could mean more than you think today.`,
        },
        {
            title: "Strengthen that bond!",
            body: `A month can feel long — ${friend.name.firstName} might love to hear from you.`,
        },
        {
            title: "Long time no see",
            body: `${friend.name.firstName} may be waiting for a message. Reach out today!`,
        },
        {
            title: "Keep friendships alive",
            body: `Don’t let time get in the way — message ${friend.name.firstName} and reconnect.`,
        },
        {
            title: "A quick hello goes far",
            body: `It’s been a while. ${friend.name.firstName} might appreciate a simple hello.`,
        },
        {
            title: "Bring back the rhythm",
            body: `You used to talk to ${friend.name.firstName} often. Let’s bring that back.`,
        },
        {
            title: "Your friendship matters",
            body: `${friend.name.firstName} is worth the time — message them today.`,
        },
        {
            title: "Don’t let it fade",
            body: `It’s been a while since you heard from ${friend.name.firstName}. Reignite the conversation.`,
        },
        {
            title: "Friendships need fuel 🔥",
            body: `One message to ${friend.name.firstName} might spark something great.`,
        },
        {
            title: "30 days, just like that",
            body: `Time flies. Reach out to ${friend.name.firstName} and catch up.`,
        },
        {
            title: "Touch base today",
            body: `${friend.name.firstName} may not realize it, but they’d love to hear from you.`,
        },
        {
            title: "Life gets busy",
            body: `Still, it’s worth taking a moment for ${friend.name.firstName}.`,
        },
        {
            title: "Keep friendships warm",
            body: `A quick message to ${friend.name.firstName} helps keep your bond strong.`,
        },
        {
            title: "Have a minute?",
            body: `Send a note to ${friend.name.firstName}. You’ll both be glad you did.`,
        },
        {
            title: "A little effort, big results",
            body: `Check in on ${friend.name.firstName} — even a small hello can brighten their day.`,
        },
        {
            title: "Strong ties take small steps",
            body: `Start by saying hi to ${friend.name.firstName} today.`,
          },
          {
            title: "Let them know you’re thinking of them",
            body: `Reach out to ${friend.name.firstName} — even if it’s just to say 'Hey'.`,
          },
          {
            title: "It’s not too late",
            body: `${friend.name.firstName} may still be hoping to hear from you.`,
          },
          {
            title: "Circle back today",
            body: `No need for a big update — a simple 'How are you?' to ${friend.name.firstName} works.`,
          },
          {
            title: "Keep your connections strong",
            body: `Stay in touch with ${friend.name.firstName}. It’s worth the moment.`,
          },
          {
            title: "Still friends, just quiet",
            body: `Let ${friend.name.firstName} know you’re still here for them.`,
          },
          {
            title: "Pick up the thread",
            body: `Even after 30 days, your bond with ${friend.name.firstName} still matters.`,
          },
          {
            title: "Don’t ghost your growth",
            body: `Friendships like the one with ${friend.name.firstName} deserve a little time today.`,
          },
          {
            title: "One tap away",
            body: `${friend.name.firstName} is just one tap from reconnecting.`,
          },
          {
            title: "Reach out, no pressure",
            body: `You don’t need a reason to say hi to ${friend.name.firstName}.`,
          },
          {
            title: "Make their day",
            body: `${friend.name.firstName} might smile just seeing your name pop up.`,
          },
          {
            title: "Friends aren't just memories",
            body: `Remind ${friend.name.firstName} they’re still part of your life.`,
          },
    ],

    hangoutSuggestion: (friend: Friend): NotificationMessage[] => [
        {
            title: "Connect with a friend!",
            body: `You should see if ${friend.name.firstName} is free to hang out this week`
        }, 
        {
            title: "Feeling hungry?",
            body: `I bet ${friend.name.firstName} might want to grab a bite to eat`
        }, 
    ]

}