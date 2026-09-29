// API-ready data layer. Later replace the function bodies with real fetch() calls.
// UI pages only call these functions, so connecting Express/MongoDB will not require
// rewriting the dashboard components.
const seed={
 user:{id:"u-1001",name:"Swarup",email:"user@bookora.com",role:"user",photo:"https://i.pravatar.cc/150?img=12"},
 deliveries:[
 ],
 readingList:[
  {id:"RL-01",title:"The Psychology of Money",author:"Morgan Housel",category:"Finance",cover:"https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80"},
  {id:"RL-02",title:"Rich Dad Poor Dad",author:"Robert Kiyosaki",category:"Business",cover:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80"},
  {id:"RL-03",title:"The Pragmatic Programmer",author:"David Thomas",category:"Technology",cover:"https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=500&q=80"}],
 reviews:[
  ]
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