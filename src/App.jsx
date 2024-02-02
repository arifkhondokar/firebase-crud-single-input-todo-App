import { useEffect, useState } from 'react'
import { getDatabase, ref, set, push, onValue, remove, update } from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// -----------------------------------------------------

function App() {

  const database = getDatabase();

  let [info, setInfo] = useState("")
  let [todo, setTodo] = useState([])
  let [toggleBtn, setToggleBtn] = useState(false)
  let [todoId, setTodoId] = useState()


  let formHandler = (e) => {
    setInfo(e.target.value);
  }


//  write operation--------------------------
  let submitHandler = () => {
    set(push(ref(database, 'AllToDo')), {
     info: info, })
     .then(()=>{
      setInfo("")
    })
  }

  
// read operation------------------------------------
  useEffect(() => {
    const todoRef = ref(database, 'AllToDo');
    onValue(todoRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item) => {
          arr.push({...item.val(), id:item.key})
      })
      setTodo(arr)
    });
  },[]);

 
// update operation--------------------------
  let updateHandler = (item)=> {
    setTodoId(item.id)
    setInfo(item.info)
    setToggleBtn(true)
  }

  let handleEdit = ()=>{
    update(ref(database, 'AllToDo/'+ todoId ),{
      info: info})
      .then(()=>{
      setToggleBtn(false)
      setInfo("")
      toast("Data Update Succeeeded !")
    })
  }


// delete operation--------------------
  let deleteHandler = (id) => {
    remove(ref(database, 'AllToDo/'+id))
    .then(()=>(
      alert('Data Delete Succeeeded !')
    ))
  }

// alldelete operation-------------------------
  let handleAllDelete = () =>{
    remove(ref(database, 'AllToDo'))
    toast.success('🦄 All Delete Succeeeded !', {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
  }

// -------------------------------------------------

  return (
    <>
    <section className='mainSection'>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      />
      <div className='mainWrapper container'>
      <h2 className='heading'>NOTE</h2>
        <div className='inputText'>
          <input value={info} placeholder='Enter your text' onChange={formHandler} required/>
        </div>
        <div>
          {
          toggleBtn 
          ? <button onClick={handleEdit} >Update</button>
          : <button onClick={submitHandler} >Add</button>
          }
        </div>
     
        <div className='display'>
          <ul>
              {
                todo.map((item, index)=>(
                  <li key={index}>{item.info}
                  <button onClick={()=>updateHandler(item)} >Edit</button>
                  <button onClick={()=>deleteHandler(item.id)} >Delete</button>
                  </li>
                ))
              }
          </ul>
        </div>
        
        <div>
          <button onClick={handleAllDelete}>All Delete</button>
        </div>
      </div>
    </section>
    </>
  )
}

export default App
