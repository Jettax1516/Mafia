fetch("https://6641c2b83d66a67b3434d58c.mockapi.io/games-for-mafia"). then((res)=> {
   return res.json();
})
.then ((json)=>{
    console.log(json);
})
