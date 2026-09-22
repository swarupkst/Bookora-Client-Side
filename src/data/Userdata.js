// API-ready data layer. Later replace the function bodies with real fetch() calls.
// UI pages only call these functions, so connecting Express/MongoDB will not require
// rewriting the dashboard components.
const seed={
 user:{id:"u-1001",name:"Swarup",email:"user@bookora.com",role:"user",photo:"https://i.pravatar.cc/150?img=12"},
 deliveries:[
  {id:"DEL-1001",bookTitle:"Atomic Habits",author:"James Clear",fee:80,status:"Delivered",date:"2026-08-29",librarian:"City Library"},
  {id:"DEL-1002",bookTitle:"Clean Code",author:"Robert C. Martin",fee:70,status:"Dispatched",date:"2026-09-04",librarian:"Readers Hub"},
  {id:"DEL-1003",bookTitle:"The Alchemist",author:"Paulo Coelho",fee:60,status:"Pending",date:"2026-09-10",librarian:"Book Nest"},
  {id:"DEL-1004",bookTitle:"Deep Work",author:"Cal Newport",fee:90,status:"Delivered",date:"2026-07-17",librarian:"City Library"}],
 readingList:[
  {id:"RL-01",title:"The Psychology of Money",author:"Morgan Housel",category:"Finance",cover:"https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80"},
  {id:"RL-02",title:"Rich Dad Poor Dad",author:"Robert Kiyosaki",category:"Business",cover:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80"},
  {id:"RL-03",title:"The Pragmatic Programmer",author:"David Thomas",category:"Technology",cover:"https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=500&q=80"}],
 reviews:[
  {id:"RV-01",bookTitle:"Atomic Habits",rating:5,comment:"Very useful and practical book.",date:"2026-08-31"},
  {id:"RV-02",bookTitle:"Deep Work",rating:4,comment:"Helpful ideas for focused work.",date:"2026-07-20"}],
 monthlySpending:[{month:"Apr",amount:120},{month:"May",amount:180},{month:"Jun",amount:90},{month:"Jul",amount:150},{month:"Aug",amount:80},{month:"Sep",amount:130}]
};
export async function API_getCurrentUser(){return seed.user}
export async function API_getDeliveries(){return [...seed.deliveries]}
export async function API_getReadingList(){return [...seed.readingList]}
export async function API_getReviews(){return [...seed.reviews]}
export async function API_getMonthlySpending(){return [...seed.monthlySpending]}
export async function API_removeFromReadingList(id){seed.readingList=seed.readingList.filter(x=>x.id!==id);return{success:true,id}}
export async function API_updateReview(id,payload){const i=seed.reviews.findIndex(x=>x.id===id);if(i<0)throw Error("Review not found");seed.reviews[i]={...seed.reviews[i],...payload};return seed.reviews[i]}
export async function API_deleteReview(id){seed.reviews=seed.reviews.filter(x=>x.id!==id);return{success:true,id}}
export async function API_updateProfile(payload){seed.user={...seed.user,...payload};return seed.user}
// Example real API:
// const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deliveries/my`,{credentials:"include"});
// if(!res.ok) throw Error("Failed"); return res.json();