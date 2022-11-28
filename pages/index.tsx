import { SlReload, SlPlus, SlCheck } from "react-icons/sl";
import { useState, useRef, useEffect } from "react"


const initialWordList = ['la moustache', 'le chemin', 'je cherche', 'un cheval', "j'achète", 'la niche', 'un chat', 'un chien'];
const initialWordToGuess = ''; // initialWordList[Math.floor(Math.random() * initialWordList.length)]

// const useWLStore: any = create((set, get) => ({
//   wordList: initialWordList,
//   wordToGuess: initialWordToGuess,
//   setWordToGuess: () => set((state :any) => ({ wordToGuess: get().wordList[Math.floor(Math.random() * get().wordList.length)] })),
// }));

// 
// const wordlits = ['à côté de', 'alors', 'après', 'assez', "aujourd'hui", aussi, autour, autrefois, avant, avec, beaucoup, bien, bientôt, car, chez, contre, combien, comment]
// 'C;;;;;;;; O;;;;;;;; M;;;;;;;; M;;;;;;;; É;;;;;;;; N;;;;;;;; T;;;;;;;;'


// TODO : onfocus sur letter => focus sur dernier input

const res = {
  NO_RESULT: '',
  WIN: 'win',
  LOOSE: 'loose',
}

const initialGameState = {
  ids : [0],
  letters: [],
  inputRefs: [],
  result: res.NO_RESULT,
}

export default function Home() {
  // const wordList = useWLStore((state:any) => state.wordList);
  // const wordToGuess = wordList[Math.floor(Math.random() * wordList.length)]
  //const wordToGuess = useWLStore((state:any) => state.wordToGuess);
  // const setWordToGuess = useWLStore((state:any) => state.setWordToGuess);
  
  const [appState, setAppState] = useState<any>({wordlist: initialWordList, wordToGuess:  initialWordList[Math.floor(Math.random() * initialWordList.length)]})


  const handleNewGame = () => {
    console.log("handleNewGame")
    const newWordToGuess = initialWordList[Math.floor(Math.random() * initialWordList.length)]
    setAppState({...appState, wordToGuess: newWordToGuess})
  }
  
  // useEffect(() => {
  //   handleNewGame()
  // }, []);

  return(<Game wordToGuess={appState.wordToGuess} handleNewGame={handleNewGame} />)
}



function Game(props: any) {

  const textInputs = useRef<any>(null);
  const repeatBtn = useRef<any>(null);

  const [gameState, setGameState] = useState<any>(initialGameState)
  const [say, setSay] = useState<any>(true)

  const handleInputLetter = (id: number, ref: any, letter: string) => {
    
    const ids_cp = gameState.ids.slice()
    ids_cp[id + 1] = id + 1
    
    const letters_cp = gameState.letters.slice()
    letters_cp[id] = letter
    
    const inputRefs_cp = gameState.inputRefs.slice()
    inputRefs_cp[id] = ref

    setGameState({...gameState, ids: ids_cp, letters: letters_cp, inputRefs: inputRefs_cp})
  }

  const handleDeleteLetter = () => {
    if (gameState.ids.length > 1) {
      const ids_cp = gameState.ids.slice()
      ids_cp.pop()
      
      const letters_cp = gameState.letters.slice()
      letters_cp.pop()

      const inputRefs_cp = gameState.inputRefs.slice()
      inputRefs_cp.pop()

      setGameState({...gameState, ids: ids_cp, letters: letters_cp, inputRefs: inputRefs_cp})
    }

  }

  const speechHandler = () => {
    let a = 'le mot'
    if  (props.wordToGuess.trim().includes(' ') || props.wordToGuess.includes("'")) {
      a = 'les mots'
    }
    speech("écris " + a + " :" + props.wordToGuess)
    focusLastInput()
  }

  const speech = (str: string) => {
    let synth = window.speechSynthesis;
    let utterThis = new SpeechSynthesisUtterance(str);
    utterThis.lang = 'fr-FR';
    synth.speak(utterThis);
  }

  const submitWord = () => {
    if (props.wordToGuess.toUpperCase() === gameState.letters.join('').toUpperCase()) {
      setGameState({...gameState, result: res.WIN})
      speech("Bien joué!")
      // window.location.reload();
    } else {
      setGameState({...gameState, result: res.LOOSE})
      speech("Non, ce n'est pas ça")
    }
    focusLastInput()
  }

  const focusLastInput = () => {
    textInputs?.current?.lastChild?.focus()
  }

  const reloadGame = () => {
    setGameState(initialGameState)
    props.handleNewGame()
    setSay(true)
  }

  useEffect(() => {
    focusLastInput()
    if (textInputs !== null) {
      textInputs.current.lastChild.value = ''
    }
    if (say) {
      setTimeout(speechHandler, 300)
      setSay(false)
    }
  });

  useEffect(() => {
    console.log("first render")
  }, []);



  return (
    <div className='App text-center'>
      <h1 className="text-4xl py-5 text-purple bg-slate-100">J'écris mes mots</h1>
      <hr />
      <br />
      <br />
      <button ref={repeatBtn} className="inline-block px-6 py-2.5 bg-slate-400 text-white font-medium text-xl leading-tight uppercase rounded shadow-md hover:bg-slate-400 hover:shadow-lg focus:bg-slate-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-400 active:shadow-lg transition duration-150 ease-in-out" onClick={() => speechHandler()}><SlReload className="inline-block align-middle" /> Dis les mots</button>
      <br />
      <br />
      <div ref={textInputs}>
        {gameState.ids.map((id: number) => {
          return (<LetterInput id={id} key={id} handleInputLetter={handleInputLetter} focusLastInput={focusLastInput} handleDeleteLetter={handleDeleteLetter} />)
        })}
      </div>
      {gameState.result === res.LOOSE ?
        <div>
          <Answer word={props.wordToGuess} />
          <div className="text-3xl font-bold text-pink-800 py-10">Non non, ce n'est pas ça 😐</div>
        </div> : ''}
      {gameState.result === res.WIN ? <div className="text-3xl font-bold text-purple py-10 ">Bien joué! 😊</div> : ''}
      {gameState.result !== res.NO_RESULT ? <button className="inline-block px-6 py-2.5 bg-purple text-white font-medium text-xl leading-tight uppercase rounded shadow-md hover:bg-purple hover:shadow-lg focus:bg-purple focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple active:shadow-lg transition duration-150 ease-in-out" onClick={reloadGame}><SlPlus className="inline-block align-middle" /> Nouveaux mots</button> : ''}
      {gameState.result == res.NO_RESULT ? <div><br /><button className="inline-block px-6 py-2.5 bg-purple text-white font-medium text-xl leading-tight uppercase rounded shadow-md hover:bg-purple hover:shadow-lg focus:bg-purple focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple active:shadow-lg transition duration-150 ease-in-out" onClick={() => submitWord()}><SlCheck className="inline-block align-middle" /> Vérifie les mots</button></div> : ''}
    </div>

  )
}

function LetterInput(props: any) {
  const [letter, setLetter] = useState("")

  const textInput: React.MutableRefObject<null> = useRef(null);

  const handleKeyDown = (event: any) => {
    if (event.key === "Backspace") {
      console.log('Backspace key pressed')
      props.handleDeleteLetter()
    }
    if (event.key === "Delete") {
      console.log('Delete key pressed')
      props.handleDeleteLetter()
    }
  }

  const regex = new RegExp("[a-zàâçéèêëîïôûùüÿñæœ ']", "i");

  const handleChangeValue = (event: any) => {
    const letter = event.target.value
    if (regex.test(letter)) {
      setLetter(letter);
      props.handleInputLetter(props.id, textInput, letter)
    }
  }

  // text-7xl w-14

  return (
    <input
      ref={textInput}
      id={props.id}
      autoCapitalize="off"
      className="text-2xl w-4 m-0.5 sm:text-5xl sm:w-10 sm:m-1 font-mono shadow appearance-none border-none rounded text-purple leading-tight focus:outline-none focus:shadow-outline p-0 text-center"
      maxLength={1}
      // pattern='/^[a-zàâçéèêëîïôûùüÿñæœ]$/i' // not working
      type='text'
      value={letter}
      placeholder=''
      // onChange={(e) => setLetter(e.target.value)}
      onKeyDown={handleKeyDown}
      onChange={handleChangeValue}
      onFocus={props.focusLastInput}
    />
  )
}

function Answer(props: any) {
  const wordToGuess = props.word
  return (
    <div className="answer">
      {wordToGuess.split("").map((letter: any, i: number) => {
        return (<AnswerInput letter={letter} key={i} />)
      })}
      <AnswerInput letter="" />
    </div>
  )
}

function AnswerInput(props: any) {
  return (
    <input
      autoCapitalize="off"
      className="text-2xl w-4 m-0.5 sm:text-5xl sm:w-10 sm:m-1 font-mono shadow appearance-none border-none rounded text-pink-800 leading-tight focus:outline-none focus:shadow-outline p-0 text-center"
      maxLength={1}
      type='text'
      value={props.letter}
      placeholder=''
      readOnly={true}
    />
  )
}