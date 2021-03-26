$(document).ready(()=> {
    //UPDATING ITEM IN THE LIST
  $(".edit-me").click( function(e) {
    let userInput = prompt("Type in new item",e.target.parentElement.parentElement.querySelector(".item-text").innerHTML);
    
        if(userInput){
            axios.post("/update_item",{
                text: userInput,
                _id: e.target.getAttribute("data-id")
            }).then(() => {
                e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput
            }).catch((err) => {
                console.log('err')
            });
        }
    });

    // DELETING ITEM FROM LIST
    $(".delete-me").click(function (e) {
      if(confirm('Do you want to delete this item?')){
          axios.post('/delete_item',{
              _id: e.target.getAttribute('data-id')
          }).then(() => {
              e.target.parentElement.parentElement.remove()
          }).catch((err) => {
              console.log(err)
          });
      }
    });




});
