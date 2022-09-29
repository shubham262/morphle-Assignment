import React, { useState, useEffect, useRef, useCallback } from 'react'
import debounce from 'lodash.debounce';
import './App.css';
import MatElem from './MatElem';

function App() {
  var n = 60;//colm
  var m = 20;//rows

  // 300 -> visited
  // 400-> focused
  // 500 -> captured
  // 100 -> not visited



  // const [currKey, setCurrKey] = useState({x:0, j:4})
  const [x, _setX] = useState(m / 2);
  const [y, _setY] = useState(n / 2);
  const [obj, setObj] = useState({ 'visited': [], 'focused': [[0, 0]], 'captured': [] })

  const [sysState, setSysState] = useState("idle")

  const parent = useRef();
  // parent.current.children && parent.current.children.forEach(element => {
  //   console.log(element)

  // })
  // console.log(parent.current && parent.current.children)
  // if(parent.current && parent.current.children && parent.current.children[0])
  // obj.focused &&parent.current&& obj.focused.map((m)=>{
  //     parent.current.children[m[0]].children[m[1]].classList.add("focused");
  //     console.log(parent.current.children[m[0]].children[m[1]])
  // })
  // useEffect(() => {
  // }, [parent.current])



  const xRef = useRef(x);
  const yRef = useRef(y);

  const setX = data => {
    xRef.current = data;
    _setX(data);
  }

  const setY = data => {
    yRef.current = data;
    _setY(data);
  }
  const [lastFocused, setLastFocused] = useState([])
  // let lastFocused = '';
  const [currentlyFocusing, setCurrentlyFocusing] = useState([])
  // let currentlyFocusing = '';

  // const focusExecute= async (coordinates)=>{
  //   setSysState("focused")
  //   console.log('focusing', coordinates[0], coordinates[1]);
  //   // change(coordinates[0], coordinates[1], 'focused');
  //   updateMat(coordinates[0], coordinates[1], 400)
  //   lastFocused = coordinates;
  // };

  const focusExecute= async(coordinates) => {
    setSysState("focused")
    // console.log(sysState)
    console.log('focusing', coordinates[0], coordinates[1]);
    // change(coordinates[0], coordinates[1], 'focused');
    updateMat(coordinates[0], coordinates[1], 400)
    // lastFocused = coordinates;
    setLastFocused(coordinates)
    setSysState("idle")
    console.log("focused updated"+ sysState)
    // console.log(sysState)
  }


  const captureExecute= async coordinates => {
    console.log("in capturing")
    setSysState("captured")
      console.log('capturing', coordinates[0], coordinates[1]);
      // change(coordinates[0], coordinates[1], 'focused');
      updateMat(coordinates[0], coordinates[1], 500)
      setSysState("idle")
  }


  // const captureExecute = async (coordinates)=>{
  //   setSysState("captured")
  //   lastFocused = coordinates;
  //   setTimeout(() => {
  //     if (lastFocused == currentlyFocusing) {
  //       // change(lastFocused[0], lastFocused[1], 'captured');
  //       updateMat(coordinates[0], coordinates[1], 500)
  //       console.log('capturing', currentlyFocusing);
  //     }
  //   }, 2000);
  // }

  // export default function MyComponent() {
//     const [searchTerm, setSearchTerm] = useState('');
//     const launchSearch = async (searchValue: string): Promise<any> => {
//         console.log(searchValue);
//     };

//     const delayedSearch = useCallback(
//         debounce(async (searchTerm) => {
//             await launchSearch(searchTerm);
//         }, 2000),
//         []
//     );
//     useEffect(() => {
//         if (searchTerm.length >= 2) {
//             delayedSearch(searchTerm);
//         }
//     }, [searchTerm]);

// }

const focusCallback = useCallback(
  debounce(async (coordinates)=>{
    await focusExecute(coordinates);
  },3000),[]
)


const captureCallback = useCallback(
  debounce( async (coordinates)=>{
    await captureExecute(coordinates);
  },2000),[]
)
// const delayedSearch = useCallback(
//           debounce(async (searchTerm) => {
//               await launchSearch(searchTerm);
//           }, 2000),
//           []
//       );



  const focus = debounce(coordinates => {
    console.log('focusing', coordinates[0], coordinates[1]);
    // change(coordinates[0], coordinates[1], 'focused');
    updateMat(coordinates[0], coordinates[1], 400)
    lastFocused = coordinates;
    setTimeout(() => {
      if (lastFocused == currentlyFocusing) {
        // change(lastFocused[0], lastFocused[1], 'captured');
        updateMat(coordinates[0], coordinates[1], 500)
        console.log('capturing', currentlyFocusing);
      }
    }, 2000);
  }, 3000, {
    'leading': false,
    'trailing': true
  });

  const tempArr = makeArray(n, m, 100);
  const [matrix, setMatrix] = useState(tempArr)


  // const [index, setindex] = useState([2,6]);

  // temp[x][y]=-3

  // const [e.code, setAction] = useState("keyA");
  function updateMat(r, c, val) {
    console.log(r, c, val)
    setMatrix(prev => {
      prev[r][c] = val;
      return prev;
    })
  }




  let keyboardEvent = (e) => {
      if (e.code === "ArrowLeft") {
        setY(prev => {
          if(prev>=0)
            return prev-1;
          else
            return prev;
        })
        // change(x, y,'visited');
      }
      else if (e.code === "ArrowRight") {
        setY(prev => {
          if(prev<n)
            return prev+1;
          else
            return prev;
        })
        // change(x, y,'visited');

      }
      else if (e.code === "ArrowUp") {
        setX(prev => {
          if(prev>=0)
            return prev-1;
          else
            return prev;
        })
        // change(x, y,'visited');

      }
      else if (e.code === "ArrowDown") {
        setX(prev => {
          if(prev<m)
            return prev+1;
          else
            return prev;
        })
    
      }

  }
  useEffect(() => {
    setCurrentlyFocusing([x,y]);
    updateMat(x, y, 300)

    // change(x, y, 'visited')
      
      // console.log(x, y);
      //if system is idle then do latest x,y to focus, state chabnges to focus from idle
      // focus(currentlyFocusing);

  }, [ x, y])

  useEffect(()=>{
    console.log("in useEffect:"+ sysState, lastFocused, currentlyFocusing)
     
    if(sysState=="idle" && lastFocused!== currentlyFocusing){
      console.log("hello")
      // focusExecute(currentlyFocusing);
      focusCallback(currentlyFocusing);
    }
    else if(sysState==="idle" && lastFocused== currentlyFocusing){
      console.log("hhi")
      // captureExecute(currentlyFocusing)
      captureCallback(currentlyFocusing);
    }
    else{
      setSysState("idle")
    }
  },[sysState, x, y, currentlyFocusing, lastFocused])



  // console.log(currKey)

  useEffect(() => {
    if(x>=0 || y>=0 || x<m || y<n)
      document.addEventListener('keyup', keyboardEvent);
  }, []);



  function makeArray(w, h, val) {
    var arr = [];
    for (let i = 0; i < h; i++) {
      arr[i] = [];
      for (let j = 0; j < w; j++) {
        arr[i][j] = val;
      }
    }
    return arr;
  }

  // const matrix = makeArray(n, m, 1000);
  // change(x,y,"focused")

  return (
    <div >
      <div ref={parent} style={{ border:"2px solid black"}} >
        {matrix && matrix.map((row, i) => (
          <div key={i} style={{color: "white"}}  >
            {row.map((col, j) => {
              // setindex([i,j]);
              return (
                <MatElem key={j} col={col} color={x === i && y === j ? "green" : ""} ind={[i, j]} />
              )
            })}
          </div>
        ))}
      </div>
      <div>
        Focused : dotted-blue, captured : solid-black, visited: grey, not visited: white
      </div>
    </div>
  );
}

export default App;