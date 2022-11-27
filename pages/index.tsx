import { cpSync } from "fs";
import { cp } from "fs/promises";
import { KeyboardEventHandler, ReactPropTypes, useState, useRef, useEffect } from "react"

const wordList = ['la moustache', 'le chemin', 'je cherche', 'un cheval', "j'achète", 'la niche', 'un chat', 'un chien'];
// const wordlits = ['à côté de', 'alors', 'après', 'assez', "aujourd'hui", aussi, autour, autrefois, avant, avec, beaucoup, bien, bientôt, car, chez, contre, combien, comment]
// 'C;;;;;;;; O;;;;;;;; M;;;;;;;; M;;;;;;;; É;;;;;;;; N;;;;;;;; T;;;;;;;;'


// TODO : onfocus sur letter => focus sur dernier input
// TODO : backspace or delete handle => remmove last last ref (focus auto sur dernier)

const wordToGuess = wordList[Math.floor(Math.random() * wordList.length)];


export default function Home() {

  const res = {
    NO_RESULT: '',
    WIN: 'win',
    LOOSE: 'loose',
  }

  const textInputs = useRef<any>(null);
  const repeatBtn = useRef<any>(null);
  const [ids, setIds] = useState<number[]>([0]);
  const [letters, setLetters] = useState<string[]>([]);
  const [inputRefs, setInputRefs] = useState<any[]>([]);
  const [result, setResult] = useState<string>(res.NO_RESULT);



  const handleInputLetter = (id: number, ref: any, letter: string) => {
    const ids_cp = Array.from(ids, e => e)
    ids_cp[id + 1] = id + 1
    setIds(ids_cp)

    const letters_cp = Array.from(letters, e => e)
    letters_cp[id] = letter
    setLetters(letters_cp)

    const inputRefs_cp = Array.from(inputRefs, e => e)
    inputRefs_cp[id] = ref
    setInputRefs(inputRefs_cp)
  }

  const handleDeleteLetter = () => {
    if (ids.length > 1) {
      const ids_cp = Array.from(ids, e => e)
      ids_cp.pop()
      setIds(ids_cp)

      const letters_cp = Array.from(letters, e => e)
      letters_cp.pop()
      setLetters(letters_cp)

      const inputRefs_cp = Array.from(inputRefs, e => e)
      inputRefs_cp.pop()
      setInputRefs(inputRefs_cp)
    }

  }

  const speechHandler = (str: string) => {
    let a = 'le mot'
    if  (wordToGuess.trim().includes(' ') || wordToGuess.includes("'")) {
      a = 'les mots'
    }
    speech("écris " + a + " :" + wordToGuess)
    focusLastInput()
  }

  const speech = (str: string) => {
    let synth = window.speechSynthesis;
    let utterThis = new SpeechSynthesisUtterance(str);
    utterThis.lang = 'fr-FR';
    synth.speak(utterThis);
  }

  const submitWord = () => {
    if (wordToGuess.toUpperCase() === letters.join('').toUpperCase()) {
      setResult(res.WIN)
      speech("Bien joué!")
      // window.location.reload();
    } else {
      setResult(res.LOOSE)
      speech("Non, ce n'est pas ça")
    }
    focusLastInput()
  }

  const focusLastInput = () => {
    textInputs?.current?.lastChild?.focus()
  }

  const reloadGame = () => {
    window.location.reload();
  }

  useEffect(() => {
    focusLastInput()
    if (textInputs !== null) {
      textInputs.current.lastChild.value = ''
    }

  });

  useEffect(() => {
    

    repeatBtn.current?.click();
    console.log(repeatBtn)

    //speechHandler("écris " + a + " :" + wordToGuess)
  }, []);




  return (
    <div className='App text-center'>
      <h1 className="text-4xl py-5 text-purple bg-slate-100">J'écris mes mots</h1>
      <hr />
      <br />
      <br />
      <button ref={repeatBtn} className="inline-block px-6 py-2.5 bg-slate-400 text-white font-medium text-xl leading-tight uppercase rounded shadow-md hover:bg-slate-400 hover:shadow-lg focus:bg-slate-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-400 active:shadow-lg transition duration-150 ease-in-out" onClick={() => speechHandler(wordToGuess)}>🔊 répète le mot</button>
      <br />
      <br />
      <div ref={textInputs}>
        {ids.map((id: number) => {
          return (<LetterInput id={id} key={id} handleInputLetter={handleInputLetter} focusLastInput={focusLastInput} handleDeleteLetter={handleDeleteLetter} />)
        })}
      </div>
      {result === res.LOOSE ?
        <div>
          <Answer word={wordToGuess} />
          <div className="text-3xl font-bold text-pink-800 py-10">Non non, ce n'est pas ça 😐</div>
        </div> : ''}
      {result === res.WIN ? <div className="text-3xl font-bold text-purple py-10 ">Bien joué! 😊</div> : ''}
      {result !== res.NO_RESULT ? <button className="inline-block px-6 py-2.5 bg-purple text-white font-medium text-xl leading-tight uppercase rounded shadow-md hover:bg-purple hover:shadow-lg focus:bg-purple focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple active:shadow-lg transition duration-150 ease-in-out" onClick={reloadGame}>⚡ Nouveau mot</button> : ''}
      {result == res.NO_RESULT ? <div><br /><button className="inline-block px-6 py-2.5 bg-purple text-white font-medium text-xl leading-tight uppercase rounded shadow-md hover:bg-purple hover:shadow-lg focus:bg-purple focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple active:shadow-lg transition duration-150 ease-in-out" onClick={() => submitWord()}>✍ vérifie le mot</button></div> : ''}
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
  return (
    <div className="answer">
      {props.word.split("").map((letter: any, i: number) => {
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
    />
  )
}