// ✅ Updated script.js with Fibonacci Canvas Spiral Animation 🎨

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAatSsPI-Y8V1LysK_aj-0CbxP64DdsqPs",
  authDomain: "sound-of-math.firebaseapp.com",
  projectId: "sound-of-math",
  storageBucket: "sound-of-math.appspot.com",
  messagingSenderId: "461875022957",
  appId: "1:461875022957:web:ac41f4d02429d8a3204364"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const patternNoteMap = {
  "Addition": {
    root: "C4",
    scale: "major",
    notes: ["C4", "D4", "E4", "F4", "G4", "A4", "G4", "E4", "C4", "E4", "D4", "F4", "G4", "E4", "D4", "C4"]
  },
  "Subtraction": {
    root: "D4",
    scale: "minor",
    notes: ["D4", "C4", "A3", "G3", "F3", "G3", "A3", "B3", "D4", "C4", "A3", "F3", "E3", "C3", "D3", "D4"]
  },
  "Multiplication": {
    root: "E4",
    scale: "lydian",
    notes: ["E4", "F#4", "G#4", "B4", "E5", "C#5", "A4", "G#4", "F#4", "D#4", "E4", "A4", "G#4", "B4", "F#4", "E4"]
  },
  "Division": {
    root: "G4",
    scale: "dorian",
    notes: ["G4", "F4", "D4", "C4", "A3", "B3", "D4", "E4", "F4", "G4", "E4", "C4", "A3", "F3", "D3", "G4"]
  },
  "Even Numbers": {
    root: "A4",
    scale: "mixolydian",
    notes: ["A4", "C5", "E5", "G5", "F5", "E5", "C5", "A4", "A4", "C5", "E5", "G5", "F5", "D5", "B4", "A4"]
  },
  "Odd Numbers": {
    root: "B3",
    scale: "aeolian",
    notes: ["B3", "D4", "F4", "A4", "C5", "B4", "G4", "F4", "E4", "D4", "C4", "A3", "G3", "F3", "E3", "B3"]
  },
  "Prime Numbers": {
    root: "C4",
    scale: "phrygian",
    notes: ["C4", "D4", "F4", "G4", "A4", "C5", "B4", "G4", "D4", "F4", "C4", "A3", "E4", "F4", "G4", "C5"]
  },
  "Perfect Squares": {
    root: "D4",
    scale: "locrian",
    notes: ["D4", "G4", "B4", "C5", "F4", "G4", "A4", "C5", "E4", "F4", "D4", "A3", "C4", "D4", "B3", "D4"]
  },
  "Doubling": {
    root: "E4",
    scale: "major",
    notes: ["E4", "G4", "C5", "E5", "G5", "C6", "E4", "E5", "C4", "G4", "C5", "E5", "G5", "C6", "E5", "G4"]
  },
  "Halving": {
    root: "F4",
    scale: "minor",
    notes: ["F4", "D4", "A3", "F3", "C3", "A2", "F2", "D2", "C2", "A1", "F1", "C1", "A0", "F0", "D0", "F0"]
  },
  "Counting": {
    root: "G3",
    scale: "ionian",
    notes: ["G3", "A3", "B3", "C4", "D4", "E4", "F#4", "G4", "A4", "B4", "C5", "D5", "E5", "F#5", "G5", "A5"]
  },
  "Skip Counting by 2": {
    root: "A3",
    scale: "major",
    notes: ["A3", "C4", "E4", "G4", "B4", "D5", "F5", "A5", "G5", "E5", "C5", "A4", "F4", "D4", "B3", "A3"]
  },
  "Skip Counting by 5": {
    root: "C3",
    scale: "mixolydian",
    notes: ["C3", "G3", "D4", "A4", "E5", "B5", "F5", "C5", "G4", "D4", "A3", "E3", "B2", "F2", "C2", "G1"]
  },
  "Number Bonds": {
    root: "D3",
    scale: "phrygian",
    notes: ["D3", "F3", "A3", "C4", "E4", "G4", "F4", "E4", "C4", "A3", "F3", "D3", "C3", "B2", "A2", "G2"]
  },
  "Commutative Property (Add)": {
    root: "E3",
    scale: "lydian",
    notes: ["E3", "F#3", "G#3", "A3", "B3", "C#4", "D#4", "E4", "D#4", "C#4", "B3", "A3", "G#3", "F#3", "E3", "E3"]
  },
  "Commutative Property (Multiply)": {
    root: "F3",
    scale: "dorian",
    notes: ["F3", "G3", "A3", "C4", "D4", "E4", "F4", "G4", "A4", "C5", "B4", "G4", "F4", "D4", "C4", "F3"]
  },
  "Associative Property": {
    root: "G3",
    scale: "aeolian",
    notes: ["G3", "B3", "D4", "F4", "A4", "C5", "B4", "G4", "E4", "D4", "B3", "A3", "F3", "E3", "D3", "G3"]
  },
  "Distributive Property": {
    root: "A3",
    scale: "phrygian",
    notes: ["A3", "C4", "E4", "F4", "G4", "A4", "C5", "D5", "E5", "G5", "F5", "D5", "B4", "A4", "G4", "A3"]
  },
  "Identity Property (Add)": {
    root: "B3",
    scale: "locrian",
    notes: ["B3", "C4", "B3", "C4", "D4", "B3", "D4", "C4", "E4", "C4", "D4", "B3", "C4", "B3", "C4", "B3"]
  },
  "Identity Property (Multiply)": {
    root: "C4",
    scale: "major",
    notes: ["C4", "E4", "C4", "E4", "G4", "C5", "G4", "C4", "F4", "C4", "F4", "A4", "C4", "A4", "C4", "C4"]
  },
  "Zero Property": {
    root: "C3",
    scale: "minor",
    notes: ["C3", "Rest", "Rest", "C3", "Rest", "Rest", "C3", "C3", "Rest", "Rest", "C3", "C3", "C3", "Rest", "Rest", "C3"]
  },
  "Greater Than": {
    root: "D4",
    scale: "major",
    notes: ["D4", "E4", "F#4", "G4", "A4", "B4", "C#5", "D5", "B4", "C#5", "D5", "E5", "F#5", "G5", "A5", "B5"]
  },
  "Less Than": {
    root: "E4",
    scale: "minor",
    notes: ["E5", "D5", "C5", "B4", "A4", "G4", "F#4", "E4", "D4", "C4", "B3", "A3", "G3", "F3", "E3", "D3"]
  },
  "Equal To": {
    root: "F4",
    scale: "major",
    notes: ["F4", "A4", "F4", "A4", "F4", "A4", "F4", "A4", "F4", "A4", "F4", "A4", "F4", "A4", "F4", "A4"]
  },
  "Not Equal To": {
    root: "G4",
    scale: "locrian",
    notes: ["G4", "A4", "G#4", "A4", "B4", "Rest", "C5", "Rest", "D5", "Rest", "B4", "Rest", "G4", "Rest", "F4", "Rest"]
  },
  "Number Line": {
    root: "A3",
    scale: "dorian",
    notes: ["A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5"]
  },
  "Ordinal Numbers": {
    root: "B3",
    scale: "mixolydian",
    notes: ["B3", "D4", "F#4", "G4", "A4", "B4", "C#5", "D5", "B4", "C#5", "A4", "G4", "F#4", "E4", "D4", "B3"]
  },
  "Place Value": {
    root: "C4",
    scale: "major",
    notes: ["C4", "Rest", "E4", "Rest", "G4", "Rest", "C5", "Rest", "G4", "Rest", "E4", "Rest", "C4", "Rest", "C4", "Rest"]
  },
 "Rounding": {
    root: "D4",
    scale: "major",
    notes: ["D4", "E4", "F#4", "G4", "A4", "B4", "C#5", "A4", "F#4", "D4", "C4", "D4", "F#4", "E4", "D4", "D4"]
  },
  "Estimation": {
    root: "E3",
    scale: "mixolydian",
    notes: ["E3", "G3", "B3", "D4", "F4", "G4", "E4", "C4", "B3", "G3", "F3", "D3", "C3", "B2", "E3", "E3"]
  },
  "Tally Marks": {
    root: "F3",
    scale: "minor",
    notes: ["F3", "F3", "F3", "F3", "G3", "Rest", "F3", "F3", "F3", "F3", "G3", "Rest", "F3", "F3", "F3", "F3"]
  },
  "Patterns": {
    root: "G3",
    scale: "dorian",
    notes: ["G3", "A3", "G3", "A3", "B3", "C4", "B3", "C4", "D4", "E4", "D4", "E4", "F4", "G4", "F4", "G4"]
  },
  "Calendar Reading": {
    root: "A3",
    scale: "major",
    notes: ["A3", "B3", "C#4", "D4", "E4", "F#4", "G#4", "A4", "B4", "C#5", "D5", "E5", "F#5", "G#5", "A5", "A5"]
  },
  "Clock Reading": {
    root: "B3",
    scale: "aeolian",
    notes: ["B3", "D4", "F4", "A4", "B4", "C5", "A4", "F4", "D4", "B3", "D4", "F4", "A4", "C5", "B4", "B3"]
  },
  "Money Recognition": {
    root: "C3",
    scale: "phrygian",
    notes: ["C3", "D#3", "F3", "G3", "A#3", "C4", "D#4", "F4", "G4", "A#4", "C5", "D#5", "F5", "G5", "A#5", "C6"]
  },
  "Basic Fractions": {
    root: "D3",
    scale: "locrian",
    notes: ["D3", "Rest", "A3", "Rest", "F3", "Rest", "C4", "Rest", "G3", "Rest", "D4", "Rest", "A4", "Rest", "D4", "D3"]
  },
  "Shapes": {
    root: "E3",
    scale: "major",
    notes: ["E3", "G3", "C4", "E4", "G4", "B4", "D5", "F5", "G5", "E5", "C5", "A4", "F4", "D4", "C4", "E3"]
  },
  "Solid Shapes": {
    root: "F3",
    scale: "minor",
    notes: ["F3", "A3", "C4", "Eb4", "F4", "Ab4", "C5", "Eb5", "F5", "C5", "Ab4", "F4", "Eb4", "C4", "A3", "F3"]
  },
  "Symmetry": {
    root: "G3",
    scale: "lydian",
    notes: ["G3", "A3", "B3", "C#4", "D4", "E4", "F#4", "G4", "F#4", "E4", "D4", "C#4", "B3", "A3", "G3", "G3"]
  },
  "Measurement": {
    root: "A3",
    scale: "major",
    notes: ["A3", "C4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6", "C6"]
  },
  "Weight": {
    root: "B3",
    scale: "minor",
    notes: ["B3", "D4", "F4", "A4", "C5", "B4", "G4", "E4", "D4", "C4", "A3", "G3", "F3", "D3", "B3", "B3"]
  },
  "Volume": {
    root: "C4",
    scale: "mixolydian",
    notes: ["C4", "D4", "E4", "F4", "G4", "A4", "Bb4", "C5", "Bb4", "A4", "G4", "F4", "E4", "D4", "C4", "C4"]
  },
  "Temperature": {
    root: "D4",
    scale: "phrygian",
    notes: ["D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "C5", "B4", "A4", "G4", "F4", "E4", "D4", "D4"]
  },
  "Time": {
    root: "E4",
    scale: "major",
    notes: ["E4", "F#4", "G#4", "A4", "B4", "C#5", "D#5", "E5", "F#5", "G#5", "A5", "B5", "C#6", "D#6", "E6", "E6"]
  },
    "Days in a Week": {
    root: "F3",
    scale: "major",
    notes: ["F3", "G3", "A3", "Bb3", "C4", "D4", "E4", "F4", "E4", "D4", "C4", "Bb3", "A3", "G3", "F3", "F3"]
  },
  "Months in a Year": {
    root: "G3",
    scale: "mixolydian",
    notes: ["G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4", "C4", "B3", "A3", "G3", "G3"]
  },
  "Seasons": {
    root: "A3",
    scale: "aeolian",
    notes: ["A3", "C4", "E4", "G4", "F4", "D4", "B3", "A3", "G3", "F3", "E3", "D3", "C3", "B2", "A2", "A3"]
  },
  "Data/Bar Graph": {
    root: "B3",
    scale: "dorian",
    notes: ["B3", "D4", "F4", "A4", "B4", "G4", "E4", "C4", "B3", "C4", "E4", "G4", "A4", "F4", "D4", "B3"]
  },
  "Probability": {
    root: "C3",
    scale: "phrygian",
    notes: ["C3", "D#3", "F3", "G3", "A#3", "C4", "D#4", "F4", "G4", "A#4", "C5", "D#5", "F5", "G5", "A#5", "C6"]
  },
  "Venn Diagram": {
    root: "D3",
    scale: "lydian",
    notes: ["D3", "E3", "F#3", "G#3", "A3", "B3", "C#4", "D4", "C#4", "B3", "A3", "G#3", "F#3", "E3", "D3", "D3"]
  },
  "Addition with Regrouping": {
    root: "E3",
    scale: "major",
    notes: ["E3", "G3", "C4", "E4", "G4", "B4", "C5", "E5", "B4", "G4", "E4", "C4", "G3", "E3", "C3", "E3"]
  },
  "Subtraction with Regrouping": {
    root: "F3",
    scale: "minor",
    notes: ["F3", "Ab3", "C4", "Eb4", "F4", "G4", "Bb4", "F4", "Eb4", "C4", "Ab3", "F3", "Eb3", "C3", "Ab2", "F2"]
  },
  "Skip Counting by 10": {
    root: "G3",
    scale: "dorian",
    notes: ["G3", "A3", "B3", "C4", "D4", "E4", "F#4", "G4", "A4", "B4", "C5", "D5", "E5", "F#5", "G5", "A5"]
  },
  "Time: Half Hour": {
    root: "A3",
    scale: "major",
    notes: ["A3", "C4", "E4", "Rest", "A4", "C5", "E5", "Rest", "A4", "C4", "E4", "Rest", "A3", "C3", "E3", "Rest"]
  },
  "Time: Quarter Hour": {
    root: "B3",
    scale: "aeolian",
    notes: ["B3", "D4", "F4", "A4", "C5", "B4", "G4", "F4", "E4", "D4", "C4", "A3", "G3", "F3", "E3", "B3"]
  },
  "Expanded Form": {
    root: "C4",
    scale: "major",
    notes: ["C4", "E4", "G4", "C5", "Rest", "E4", "G4", "Rest", "C4", "E4", "Rest", "G4", "C5", "Rest", "E4", "C4"]
  },
  "Word Problem (Add)": {
    root: "D3",
    scale: "mixolydian",
    notes: ["D3", "F3", "A3", "C4", "E4", "F4", "D4", "C4", "A3", "F3", "D3", "C3", "A2", "F2", "D2", "D3"]
  },
  "Word Problem (Subtract)": {
    root: "E3",
    scale: "phrygian",
    notes: ["E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "D4", "C4", "B3", "A3", "G3", "F3", "E3", "E3"]
  },
  "Fact Family": {
    root: "F3",
    scale: "lydian",
    notes: ["F3", "G3", "A3", "C4", "D4", "E4", "F4", "A4", "F4", "D4", "C4", "A3", "G3", "F3", "E3", "F3"]
  },
  "Comparing Numbers": {
    root: "G3",
    scale: "major",
    notes: ["G3", "A3", "B3", "C4", "D4", "E4", "F#4", "G4", "F#4", "E4", "D4", "C4", "B3", "A3", "G3", "G3"]
  },
  "Skip Counting by 3": {
    root: "A3",
    scale: "dorian",
    notes: ["A3", "C4", "E4", "G4", "B4", "D5", "F5", "A5", "G5", "F5", "D5", "B4", "G4", "E4", "C4", "A3"]
  },
  "Repeating Patterns": {
    root: "B3",
    scale: "mixolydian",
    notes: ["B3", "D4", "B3", "D4", "C4", "E4", "C4", "E4", "D4", "F4", "D4", "F4", "E4", "G4", "E4", "G4"]
  },
  "Simple Equation": {
    root: "C4",
    scale: "lydian",
    notes: ["C4", "D4", "E4", "F#4", "G4", "A4", "B4", "C5", "C5", "B4", "A4", "G4", "F#4", "E4", "D4", "C4"]
  },
  
};
//Second level Intermediate 
const patternNoteMapIntermediate = {
  "Square of Sum": {
    root: "G4",
    scale: "major pentatonic",
    notes: ["G4", "E4", "A4", "D5", "G5", "A4", "D4", "E4", "G4", "A4", "D5", "G5", "A4", "D4", "E4", "G4"]
  },
  "Square of Difference": {
    root: "A3",
    scale: "minor pentatonic",
    notes: ["A3", "C4", "E4", "G4", "A4", "G4", "E4", "C4", "A3", "C4", "E4", "G4", "A4", "G4", "E4", "C4"]
  },
  "Sum of Squares": {
    root: "F3",
    scale: "phrygian",
    notes: ["F3", "G3", "A3", "C4", "D4", "C4", "A3", "G3", "F3", "G3", "A3", "C4", "D4", "C4", "A3", "G3"]
  },
  "Cube of Sum": {
    root: "C4",
    scale: "major",
    notes: ["C4", "E4", "G4", "B4", "C5", "B4", "G4", "E4", "C4", "E4", "G4", "B4", "C5", "B4", "G4", "E4"]
  },
  "Cube of Difference": {
    root: "D4",
    scale: "minor pentatonic",
    notes: ["D4", "F4", "G4", "A4", "C5", "A4", "G4", "F4", "D4", "F4", "G4", "A4", "C5", "A4", "G4", "F4"]
  },
  "Power of Power Rule": {
    root: "G3",
    scale: "mixolydian",
    notes: ["G3", "A3", "B3", "C4", "D4", "F4", "G4", "B4", "G4", "F4", "D4", "C4", "B3", "A3", "G3", "E3"]
  },
  "Fourth Power of Sum": {
    root: "B3",
    scale: "phrygian",
    notes: ["B3", "C4", "D4", "E4", "F4", "E4", "D4", "C4", "B3", "F4", "E4", "D4", "C4", "B3", "A3", "G3"]
  },
  "Product of Powers Rule": {
    root: "F4",
    scale: "major pentatonic",
    notes: ["F4", "A4", "C5", "D5", "E5", "F5", "D5", "C5", "A4", "F4", "A4", "C5", "D5", "E5", "C5", "A4"]
  },
  "Power of Product Rule": {
    root: "A4",
    scale: "minor pentatonic",
    notes: ["A4", "C5", "D5", "E5", "G5", "E5", "D5", "C5", "A4", "C5", "D5", "E5", "G5", "E5", "C5", "A4"]
  },
  "Algebraic Identity Expansion": {
    root: "E4",
    scale: "lydian",
    notes: ["E4", "F#4", "G#4", "A#4", "C#5", "A#4", "G#4", "F#4", "E4", "F#4", "G#4", "A#4", "C#5", "A#4", "G#4", "F#4"]
  },
  "Perimeter of Rectangle": {
    root: "C4",
    scale: "mixolydian",
    notes: ["C4", "E4", "G4", "A4", "G4", "E4", "C4", "A3", "C4", "E4", "G4", "A4", "G4", "E4", "C4", "A3"]
  },
  "Area of Rectangle": {
    root: "D4",
    scale: "dorian",
    notes: ["D4", "F4", "A4", "C5", "A4", "F4", "D4", "C4", "D4", "F4", "A4", "C5", "A4", "F4", "D4", "C4"]
  },
  "Area of Square": {
    root: "A3",
    scale: "minor",
    notes: ["A3", "C4", "E4", "G4", "C5", "E4", "C4", "A3", "C4", "E4", "G4", "C5", "E4", "C4", "A3", "G3"]
  },
  "Perimeter of Square": {
    root: "B3",
    scale: "major",
    notes: ["B3", "D4", "F#4", "G4", "A4", "G4", "F#4", "D4", "B3", "D4", "F#4", "G4", "A4", "G4", "F#4", "D4"]
  },
  "Area of Triangle": {
    root: "E4",
    scale: "phrygian",
    notes: ["E4", "F4", "G4", "A4", "G4", "F4", "E4", "D4", "E4", "F4", "G4", "A4", "G4", "F4", "E4", "D4"]
  },
  "Area of Trapezoid": {
    root: "F4",
    scale: "harmonic minor",
    notes: ["F4", "G4", "A4", "C5", "E5", "C5", "A4", "G4", "F4", "G4", "A4", "C5", "E5", "C5", "A4", "G4"]
  },
  "Area of Circle": {
    root: "C4",
    scale: "major pentatonic",
    notes: ["C4", "D4", "E4", "G4", "A4", "G4", "E4", "D4", "C4", "D4", "E4", "G4", "A4", "G4", "E4", "D4"]
  },
  "Circumference of Circle": {
    root: "D4",
    scale: "phrygian",
    notes: ["D4", "E4", "F4", "G4", "A4", "G4", "F4", "E4", "D4", "E4", "F4", "G4", "A4", "G4", "F4", "E4"]
  },
  "Surface Area of Cube": {
    root: "A3",
    scale: "major pentatonic",
    notes: ["A3", "C4", "D4", "E4", "G4", "E4", "D4", "C4", "A3", "C4", "D4", "E4", "G4", "E4", "D4", "C4"]
  },
  "Volume of Cube": {
    root: "G3",
    scale: "aeolian",
    notes: ["G3", "A3", "Bb3", "C4", "D4", "C4", "Bb3", "A3", "G3", "A3", "Bb3", "C4", "D4", "C4", "Bb3", "A3"]
  },
  "Curved Surface Area of Cylinder": {
    root: "C4",
    scale: "dorian",
    notes: ["C4", "D4", "Eb4", "G4", "A4", "G4", "Eb4", "D4", "C4", "D4", "Eb4", "G4", "A4", "G4", "Eb4", "D4"]
  },
  "Total Surface Area of Cylinder": {
    root: "B3",
    scale: "major",
    notes: ["B3", "D4", "E4", "F#4", "A4", "F#4", "E4", "D4", "B3", "D4", "E4", "F#4", "A4", "F#4", "E4", "D4"]
  },
  "Volume of Cylinder": {
    root: "F4",
    scale: "mixolydian",
    notes: ["F4", "G4", "A4", "Bb4", "C5", "Bb4", "A4", "G4", "F4", "G4", "A4", "Bb4", "C5", "Bb4", "A4", "G4"]
  },
  "Surface Area of Cone": {
    root: "D4",
    scale: "lydian",
    notes: ["D4", "E4", "F#4", "G#4", "A4", "G#4", "F#4", "E4", "D4", "E4", "F#4", "G#4", "A4", "G#4", "F#4", "E4"]
  },
  "Volume of Cone": {
    root: "E4",
    scale: "minor pentatonic",
    notes: ["E4", "G4", "A4", "B4", "D5", "B4", "A4", "G4", "E4", "G4", "A4", "B4", "D5", "B4", "A4", "G4"]
  },
  "Surface Area of Sphere": {
    root: "G4",
    scale: "major",
    notes: ["G4", "A4", "B4", "C5", "D5", "C5", "B4", "A4", "G4", "A4", "B4", "C5", "D5", "C5", "B4", "A4"]
  },
  "Volume of Sphere": {
    root: "C4",
    scale: "phrygian",
    notes: ["C4", "Db4", "Eb4", "F4", "G4", "F4", "Eb4", "Db4", "C4", "Db4", "Eb4", "F4", "G4", "F4", "Eb4", "Db4"]
  },
  "Simple Probability": {
    root: "D3",
    scale: "dorian",
    notes: ["D3", "F3", "G3", "A3", "C4", "A3", "G3", "F3", "D3", "F3", "G3", "A3", "C4", "A3", "G3", "F3"]
  },
  "Addition of Fractions": {
    root: "A3",
    scale: "major",
    notes: ["A3", "C4", "E4", "G4", "C5", "G4", "E4", "C4", "A3", "C4", "E4", "G4", "C5", "G4", "E4", "C4"]
  },
  "Multiplication of Fractions": {
    root: "G3",
    scale: "minor",
    notes: ["G3", "Bb3", "D4", "F4", "G4", "F4", "D4", "Bb3", "G3", "Bb3", "D4", "F4", "G4", "F4", "D4", "Bb3"]
  },
  "Division of Fractions": {
    root: "E3",
    scale: "minor pentatonic",
    notes: ["E3", "G3", "A3", "B3", "D4", "B3", "A3", "G3", "E3", "G3", "A3", "B3", "D4", "B3", "A3", "G3"]
  },
  "Percentage Formula": {
    root: "F3",
    scale: "lydian",
    notes: ["F3", "G3", "A3", "B3", "C4", "B3", "A3", "G3", "F3", "G3", "A3", "B3", "C4", "B3", "A3", "G3"]
  },
  "Distance Formula": {
    root: "C4",
    scale: "aeolian",
    notes: ["C4", "D4", "Eb4", "F4", "G4", "F4", "Eb4", "D4", "C4", "D4", "Eb4", "F4", "G4", "F4", "Eb4", "D4"]
  },
  "Slope Formula": {
    root: "B3",
    scale: "mixolydian",
    notes: ["B3", "D4", "E4", "F#4", "G4", "F#4", "E4", "D4", "B3", "D4", "E4", "F#4", "G4", "F#4", "E4", "D4"]
  },
  "Midpoint Formula": {
    root: "A3",
    scale: "major pentatonic",
    notes: ["A3", "C4", "D4", "E4", "G4", "E4", "D4", "C4", "A3", "C4", "D4", "E4", "G4", "E4", "D4", "C4"]
  },
  "Pythagorean Theorem": {
    root: "G3",
    scale: "phrygian",
    notes: ["G3", "A3", "Bb3", "C4", "D4", "C4", "Bb3", "A3", "G3", "A3", "Bb3", "C4", "D4", "C4", "Bb3", "A3"]
  },
  "Quadratic Formula": {
    root: "F3",
    scale: "minor",
    notes: ["F3", "Ab3", "C4", "Eb4", "F4", "Eb4", "C4", "Ab3", "F3", "Ab3", "C4", "Eb4", "F4", "Eb4", "C4", "Ab3"]
  },
  "Sine Ratio": {
    root: "D4",
    scale: "minor pentatonic",
    notes: ["D4", "F4", "G4", "A4", "C5", "A4", "G4", "F4", "D4", "F4", "G4", "A4", "C5", "A4", "G4", "F4"]
  },
  "Cosine Ratio": {
    root: "E4",
    scale: "major",
    notes: ["E4", "G#4", "B4", "C#5", "E5", "C#5", "B4", "G#4", "E4", "G#4", "B4", "C#5", "E5", "C#5", "B4", "G#4"]
  },
  "Tangent Ratio": {
    root: "F3",
    scale: "aeolian",
    notes: ["F3", "G3", "Ab3", "Bb3", "C4", "Bb3", "Ab3", "G3", "F3", "G3", "Ab3", "Bb3", "C4", "Bb3", "Ab3", "G3"]
  },
  "Laws of Exponents": {
    root: "G3",
    scale: "dorian",
    notes: ["G3", "A3", "B3", "D4", "E4", "D4", "B3", "A3", "G3", "A3", "B3", "D4", "E4", "D4", "B3", "A3"]
  },
  "Exponent Zero Rule": {
    root: "A3",
    scale: "major pentatonic",
    notes: ["A3", "C4", "D4", "E4", "G4", "E4", "D4", "C4", "A3", "C4", "D4", "E4", "G4", "E4", "D4", "C4"]
  },
  "Negative Exponent Rule": {
    root: "B3",
    scale: "minor pentatonic",
    notes: ["B3", "D4", "E4", "F#4", "A4", "F#4", "E4", "D4", "B3", "D4", "E4", "F#4", "A4", "F#4", "E4", "D4"]
  },
  "Simple Interest": {
    root: "C4",
    scale: "mixolydian",
    notes: ["C4", "E4", "F4", "G4", "A4", "G4", "F4", "E4", "C4", "E4", "F4", "G4", "A4", "G4", "F4", "E4"]
  },
  "Compound Interest": {
    root: "D4",
    scale: "harmonic minor",
    notes: ["D4", "E4", "F4", "G#4", "A4", "G#4", "F4", "E4", "D4", "E4", "F4", "G#4", "A4", "G#4", "F4", "E4"]
  },
  "Slope-Intercept Form": {
    root: "F3",
    scale: "major pentatonic",
    notes: ["F3", "A3", "C4", "D4", "E4", "D4", "C4", "A3", "F3", "A3", "C4", "D4", "E4", "D4", "C4", "A3"]
  },
  "Point-Slope Form": {
    root: "E3",
    scale: "lydian",
    notes: ["E3", "F#3", "G#3", "A#3", "B3", "A#3", "G#3", "F#3", "E3", "F#3", "G#3", "A#3", "B3", "A#3", "G#3", "F#3"]
  },
  "Equation of Circle": {
    root: "A3",
    scale: "phrygian",
    notes: ["A3", "B3", "C4", "D4", "E4", "D4", "C4", "B3", "A3", "B3", "C4", "D4", "E4", "D4", "C4", "B3"]
  },
  "Volume of Prism": {
    root: "B3",
    scale: "dorian",
    notes: ["B3", "D4", "E4", "F#4", "G4", "F#4", "E4", "D4", "B3", "D4", "E4", "F#4", "G4", "F#4", "E4", "D4"]
  },
  "Volume of Pyramid": {
    root: "C4",
    scale: "minor pentatonic",
    notes: ["C4", "Eb4", "F4", "G4", "Bb4", "G4", "F4", "Eb4", "C4", "Eb4", "F4", "G4", "Bb4", "G4", "F4", "Eb4"]
  },
  "Area of Rhombus": {
    root: "G3",
    scale: "major",
    notes: ["G3", "B3", "C4", "D4", "E4", "D4", "C4", "B3", "G3", "B3", "C4", "D4", "E4", "D4", "C4", "B3"]
  },
  "Area of Parallelogram": {
    root: "D4",
    scale: "aeolian",
    notes: ["D4", "E4", "F4", "G4", "A4", "G4", "F4", "E4", "D4", "E4", "F4", "G4", "A4", "G4", "F4", "E4"]
  },
  "Product Rule for Derivatives": {
    root: "F3",
    scale: "minor pentatonic",
    notes: ["F3", "G3", "A#3", "C4", "D4", "C4", "A#3", "G3", "F3", "G3", "A#3", "C4", "D4", "C4", "A#3", "G3"]
  },
  "Quotient Rule for Derivatives": {
    root: "C4",
    scale: "major",
    notes: ["C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4", "C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4"]
  },
  "Chain Rule": {
    root: "G4",
    scale: "lydian",
    notes: ["G4", "A4", "B4", "C#5", "D5", "C#5", "B4", "A4", "G4", "A4", "B4", "C#5", "D5", "C#5", "B4", "A4"]
  },
  "Arithmetic Sequence Formula": {
    root: "E4",
    scale: "dorian",
    notes: ["E4", "F#4", "G#4", "A4", "B4", "A4", "G#4", "F#4", "E4", "F#4", "G#4", "A4", "B4", "A4", "G#4", "F#4"]
  },
  "Geometric Sequence Formula": {
    root: "A4",
    scale: "harmonic minor",
    notes: ["A4", "B4", "C5", "E5", "F5", "E5", "C5", "B4", "A4", "B4", "C5", "E5", "F5", "E5", "C5", "B4"]
  },
    "Sum of Arithmetic Series": {
    root: "D4",
    scale: "major pentatonic",
    notes: ["D4", "F#4", "A4", "B4", "D5", "B4", "A4", "F#4", "D4", "F#4", "A4", "B4", "D5", "B4", "A4", "F#4"]
  },
  "Sum of Geometric Series": {
    root: "E4",
    scale: "minor pentatonic",
    notes: ["E4", "G4", "A4", "B4", "D5", "B4", "A4", "G4", "E4", "G4", "A4", "B4", "D5", "B4", "A4", "G4"]
  }
};
//Third part for Advanced Level
const patternNoteMapAdvanced = {
   "Euler's Formula": {
    root: "C3",
    scale: "phrygian",
    notes: ["C3", "Db3", "E3", "F3", "G3", "F3", "E3", "Db3", "C3", "Db3", "E3", "F3", "G3", "F3", "E3", "Db3"]
  },
  "Taylor Series": {
    root: "D3",
    scale: "harmonic minor",
    notes: ["D3", "E3", "F3", "G#3", "A3", "G#3", "F3", "E3", "D3", "E3", "F3", "G#3", "A3", "G#3", "F3", "E3"]
  },
  "Maclaurin Series": {
    root: "B2",
    scale: "locrian",
    notes: ["B2", "C3", "D3", "Eb3", "F3", "Eb3", "D3", "C3", "B2", "C3", "D3", "Eb3", "F3", "Eb3", "D3", "C3"]
  },
  "L'Hôpital's Rule": {
    root: "F3",
    scale: "aeolian",
    notes: ["F3", "G3", "Ab3", "Bb3", "C4", "Bb3", "Ab3", "G3", "F3", "G3", "Ab3", "Bb3", "C4", "Bb3", "Ab3", "G3"]
  },
  "Implicit Differentiation": {
    root: "A3",
    scale: "phrygian",
    notes: ["A3", "Bb3", "C4", "D4", "Eb4", "D4", "C4", "Bb3", "A3", "Bb3", "C4", "D4", "Eb4", "D4", "C4", "Bb3"]
  },
  "Second Derivative Test": {
    root: "G3",
    scale: "dorian",
    notes: ["G3", "A3", "B3", "D4", "E4", "D4", "B3", "A3", "G3", "A3", "B3", "D4", "E4", "D4", "B3", "A3"]
  },
  "Logarithmic Differentiation": {
    root: "E3",
    scale: "lydian",
    notes: ["E3", "F#3", "G#3", "A#3", "B3", "A#3", "G#3", "F#3", "E3", "F#3", "G#3", "A#3", "B3", "A#3", "G#3", "F#3"]
  },
  "Double Angle (Sine)": {
    root: "C4",
    scale: "harmonic minor",
    notes: ["C4", "D4", "Eb4", "F#4", "G4", "F#4", "Eb4", "D4", "C4", "D4", "Eb4", "F#4", "G4", "F#4", "Eb4", "D4"]
  },
  "Double Angle (Cosine)": {
    root: "D4",
    scale: "phrygian",
    notes: ["D4", "Eb4", "F4", "G4", "A4", "G4", "F4", "Eb4", "D4", "Eb4", "F4", "G4", "A4", "G4", "F4", "Eb4"]
  },
  "Triple Angle Formula": {
    root: "A3",
    scale: "minor pentatonic",
    notes: ["A3", "C4", "D4", "E4", "G4", "E4", "D4", "C4", "A3", "C4", "D4", "E4", "G4", "E4", "D4", "C4"]
  },
  "Determinant of 2x2 Matrix": {
    root: "F3",
    scale: "aeolian",
    notes: ["F3", "G3", "Ab3", "Bb3", "C4", "Bb3", "Ab3", "G3", "F3", "G3", "Ab3", "Bb3", "C4", "Bb3", "Ab3", "G3"]
  },
  "Cramer's Rule": {
    root: "C3",
    scale: "phrygian",
    notes: ["C3", "Db3", "E3", "F3", "G3", "F3", "E3", "Db3", "C3", "Db3", "E3", "F3", "G3", "F3", "E3", "Db3"]
  },
  "Eigenvalues": {
    root: "G3",
    scale: "minor",
    notes: ["G3", "Bb3", "C4", "D4", "F4", "D4", "C4", "Bb3", "G3", "Bb3", "C4", "D4", "F4", "D4", "C4", "Bb3"]
  },
  "Matrix Inverse": {
    root: "D3",
    scale: "locrian",
    notes: ["D3", "Eb3", "F3", "Gb3", "Ab3", "Gb3", "F3", "Eb3", "D3", "Eb3", "F3", "Gb3", "Ab3", "Gb3", "F3", "Eb3"]
  },
  "Dot Product": {
    root: "A3",
    scale: "lydian",
    notes: ["A3", "B3", "C#4", "D#4", "E4", "D#4", "C#4", "B3", "A3", "B3", "C#4", "D#4", "E4", "D#4", "C#4", "B3"]
  },
  "Cross Product": {
    root: "E3",
    scale: "phrygian",
    notes: ["E3", "F3", "G3", "A3", "B3", "A3", "G3", "F3", "E3", "F3", "G3", "A3", "B3", "A3", "G3", "F3"]
  },
  "Vector Magnitude": {
    root: "G3",
    scale: "aeolian",
    notes: ["G3", "A3", "Bb3", "C4", "D4", "C4", "Bb3", "A3", "G3", "A3", "Bb3", "C4", "D4", "C4", "Bb3", "A3"]
  },
  "Gradient Vector": {
    root: "B3",
    scale: "dorian",
    notes: ["B3", "C#4", "D#4", "E4", "F#4", "E4", "D#4", "C#4", "B3", "C#4", "D#4", "E4", "F#4", "E4", "D#4", "C#4"]
  },
  "Divergence": {
    root: "F3",
    scale: "locrian",
    notes: ["F3", "Gb3", "Ab3", "Bb3", "Cb4", "Bb3", "Ab3", "Gb3", "F3", "Gb3", "Ab3", "Bb3", "Cb4", "Bb3", "Ab3", "Gb3"]
  },
  "Curl of Vector Field": {
    root: "C4",
    scale: "harmonic minor",
    notes: ["C4", "D4", "Eb4", "F#4", "G4", "F#4", "Eb4", "D4", "C4", "D4", "Eb4", "F#4", "G4", "F#4", "Eb4", "D4"]
  },
  "Laplace Transform": {
    root: "D3",
    scale: "aeolian",
    notes: ["D3", "F3", "G3", "A3", "C4", "A3", "G3", "F3", "D3", "F3", "G3", "A3", "C4", "A3", "G3", "F3"]
  },
  "Fourier Series": {
    root: "F3",
    scale: "dorian",
    notes: ["F3", "G3", "A3", "C4", "D4", "C4", "A3", "G3", "F3", "G3", "A3", "C4", "D4", "C4", "A3", "G3"]
  },
  "Limit Definition of Derivative": {
    root: "C3",
    scale: "locrian",
    notes: ["C3", "Db3", "Eb3", "F3", "Gb3", "F3", "Eb3", "Db3", "C3", "Db3", "Eb3", "F3", "Gb3", "F3", "Eb3", "Db3"]
  },
  "FTC": {
    root: "E3",
    scale: "minor pentatonic",
    notes: ["E3", "G3", "A3", "B3", "D4", "B3", "A3", "G3", "E3", "G3", "A3", "B3", "D4", "B3", "A3", "G3"]
  },
  "Chain Rule (Multivariable)": {
    root: "A3",
    scale: "phrygian",
    notes: ["A3", "Bb3", "C4", "D4", "Eb4", "D4", "C4", "Bb3", "A3", "Bb3", "C4", "D4", "Eb4", "D4", "C4", "Bb3"]
  },
  "2nd Order ODE": {
    root: "G3",
    scale: "harmonic minor",
    notes: ["G3", "A3", "Bb3", "D4", "E4", "D4", "Bb3", "A3", "G3", "A3", "Bb3", "D4", "E4", "D4", "Bb3", "A3"]
  },
  "Homogeneous ODE": {
    root: "D3",
    scale: "phrygian",
    notes: ["D3", "Eb3", "F3", "G3", "Ab3", "G3", "F3", "Eb3", "D3", "Eb3", "F3", "G3", "Ab3", "G3", "F3", "Eb3"]
  },
  "Bernoulli ODE": {
    root: "F3",
    scale: "lydian",
    notes: ["F3", "G3", "A3", "B3", "C4", "B3", "A3", "G3", "F3", "G3", "A3", "B3", "C4", "B3", "A3", "G3"]
  },
  "Separable Variables": {
    root: "C3",
    scale: "aeolian",
    notes: ["C3", "D3", "Eb3", "F3", "G3", "F3", "Eb3", "D3", "C3", "D3", "Eb3", "F3", "G3", "F3", "Eb3", "D3"]
  },
  "Binomial Theorem": {
    root: "B2",
    scale: "dorian",
    notes: ["B2", "C#3", "D#3", "E3", "F#3", "E3", "D#3", "C#3", "B2", "C#3", "D#3", "E3", "F#3", "E3", "D#3", "C#3"]
  },
  "Mean Value Theorem": {
    root: "E3",
    scale: "harmonic minor",
    notes: ["E3", "F#3", "G3", "A#3", "B3", "A#3", "G3", "F#3", "E3", "F#3", "G3", "A#3", "B3", "A#3", "G3", "F#3"]
  },
  "Rolle's Theorem": {
    root: "G3",
    scale: "minor pentatonic",
    notes: ["G3", "A#3", "C4", "D4", "F4", "D4", "C4", "A#3", "G3", "A#3", "C4", "D4", "F4", "D4", "C4", "A#3"]
  },
  "Polar → Rectangular": {
    root: "F3",
    scale: "phrygian",
    notes: ["F3", "Gb3", "Ab3", "Bb3", "C4", "Bb3", "Ab3", "Gb3", "F3", "Gb3", "Ab3", "Bb3", "C4", "Bb3", "Ab3", "Gb3"]
  },
  "Rectangular → Polar": {
    root: "D3",
    scale: "locrian",
    notes: ["D3", "Eb3", "F3", "Gb3", "Ab3", "Gb3", "F3", "Eb3", "D3", "Eb3", "F3", "Gb3", "Ab3", "Gb3", "F3", "Eb3"]
  },
  "Parabola Equation": {
    root: "A3",
    scale: "aeolian",
    notes: ["A3", "B3", "C4", "D4", "E4", "D4", "C4", "B3", "A3", "B3", "C4", "D4", "E4", "D4", "C4", "B3"]
  },
  "Ellipse Equation": {
    root: "C4",
    scale: "dorian",
    notes: ["C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4", "C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4"]
  },
  "Hyperbola Equation": {
    root: "E4",
    scale: "phrygian",
    notes: ["E4", "F4", "G4", "A4", "B4", "A4", "G4", "F4", "E4", "F4", "G4", "A4", "B4", "A4", "G4", "F4"]
  },
  "Binomial Probability": {
    root: "B3",
    scale: "minor pentatonic",
    notes: ["B3", "D4", "E4", "F#4", "A4", "F#4", "E4", "D4", "B3", "D4", "E4", "F#4", "A4", "F#4", "E4", "D4"]
  },
  "Poisson Distribution": {
    root: "A3",
    scale: "lydian",
    notes: ["A3", "B3", "C#4", "D#4", "E4", "D#4", "C#4", "B3", "A3", "B3", "C#4", "D#4", "E4", "D#4", "C#4", "B3"]
  },
    "Z-score": {
    root: "G3",
    scale: "dorian",
    notes: ["G3", "A3", "B3", "C4", "D4", "C4", "B3", "A3", "G3", "A3", "B3", "C4", "D4", "C4", "B3", "A3"]
  },
  "Variance": {
    root: "D3",
    scale: "harmonic minor",
    notes: ["D3", "E3", "F3", "G#3", "A3", "G#3", "F3", "E3", "D3", "E3", "F3", "G#3", "A3", "G#3", "F3", "E3"]
  },
  "Standard Deviation": {
    root: "F3",
    scale: "phrygian",
    notes: ["F3", "Gb3", "Ab3", "Bb3", "C4", "Bb3", "Ab3", "Gb3", "F3", "Gb3", "Ab3", "Bb3", "C4", "Bb3", "Ab3", "Gb3"]
  },
  "Covariance": {
    root: "E3",
    scale: "minor pentatonic",
    notes: ["E3", "G3", "A3", "B3", "D4", "B3", "A3", "G3", "E3", "G3", "A3", "B3", "D4", "B3", "A3", "G3"]
  },
  "Correlation Coefficient": {
    root: "C3",
    scale: "aeolian",
    notes: ["C3", "D3", "Eb3", "F3", "G3", "F3", "Eb3", "D3", "C3", "D3", "Eb3", "F3", "G3", "F3", "Eb3", "D3"]
  },
  "Bayes' Theorem": {
    root: "A3",
    scale: "phrygian",
    notes: ["A3", "Bb3", "C4", "D4", "Eb4", "D4", "C4", "Bb3", "A3", "Bb3", "C4", "D4", "Eb4", "D4", "C4", "Bb3"]
  },
  "Permutation": {
    root: "B2",
    scale: "lydian",
    notes: ["B2", "C#3", "D#3", "F3", "G3", "F3", "D#3", "C#3", "B2", "C#3", "D#3", "F3", "G3", "F3", "D#3", "C#3"]
  },
  "Combination": {
    root: "D3",
    scale: "minor pentatonic",
    notes: ["D3", "F3", "G3", "A3", "C4", "A3", "G3", "F3", "D3", "F3", "G3", "A3", "C4", "A3", "G3", "F3"]
  },
  "Expected Value": {
    root: "F3",
    scale: "dorian",
    notes: ["F3", "G3", "A3", "C4", "D4", "C4", "A3", "G3", "F3", "G3", "A3", "C4", "D4", "C4", "A3", "G3"]
  },
  "Partial Derivative": {
    root: "E3",
    scale: "aeolian",
    notes: ["E3", "F#3", "G3", "A3", "B3", "A3", "G3", "F#3", "E3", "F#3", "G3", "A3", "B3", "A3", "G3", "F#3"]
  },
  "Double Integral": {
    root: "C3",
    scale: "phrygian",
    notes: ["C3", "Db3", "Eb3", "F3", "Gb3", "F3", "Eb3", "Db3", "C3", "Db3", "Eb3", "F3", "Gb3", "F3", "Eb3", "Db3"]
  },
  "Triple Integral": {
    root: "A3",
    scale: "minor pentatonic",
    notes: ["A3", "C4", "D4", "E4", "G4", "E4", "D4", "C4", "A3", "C4", "D4", "E4", "G4", "E4", "D4", "C4"]
  },
  "Jacobian Determinant": {
    root: "G3",
    scale: "dorian",
    notes: ["G3", "A3", "B3", "D4", "E4", "D4", "B3", "A3", "G3", "A3", "B3", "D4", "E4", "D4", "B3", "A3"]
  },
  "Parametric Equations": {
    root: "F3",
    scale: "aeolian",
    notes: ["F3", "G3", "Ab3", "Bb3", "C4", "Bb3", "Ab3", "G3", "F3", "G3", "Ab3", "Bb3", "C4", "Bb3", "Ab3", "G3"]
  },
  "Lagrange Interpolation": {
    root: "E3",
    scale: "phrygian",
    notes: ["E3", "F3", "G3", "A3", "B3", "A3", "G3", "F3", "E3", "F3", "G3", "A3", "B3", "A3", "G3", "F3"]
  },
  "Newton's Divided Difference": {
    root: "D3",
    scale: "minor pentatonic",
    notes: ["D3", "F3", "G3", "A3", "C4", "A3", "G3", "F3", "D3", "F3", "G3", "A3", "C4", "A3", "G3", "F3"]
  },
  "Gradient Descent": {
    root: "C3",
    scale: "harmonic minor",
    notes: ["C3", "D3", "Eb3", "F#3", "G3", "F#3", "Eb3", "D3", "C3", "D3", "Eb3", "F#3", "G3", "F#3", "Eb3", "D3"]
  },
  "Fourier Transform": {
    root: "A3",
    scale: "lydian",
    notes: ["A3", "B3", "C#4", "D#4", "E4", "D#4", "C#4", "B3", "A3", "B3", "C#4", "D#4", "E4", "D#4", "C#4", "B3"]
  },
  "Complex Number": {
    root: "G3",
    scale: "aeolian",
    notes: ["G3", "A3", "Bb3", "C4", "D4", "C4", "Bb3", "A3", "G3", "A3", "Bb3", "C4", "D4", "C4", "Bb3", "A3"]
  },
  "Modulus of Complex": {
    root: "F3",
    scale: "minor pentatonic",
    notes: ["F3", "G#3", "A#3", "C4", "D#4", "C4", "A#3", "G#3", "F3", "G#3", "A#3", "C4", "D#4", "C4", "A#3", "G#3"]
  }
};
// Function to show visual for each pattern
const patternVisualMap = {
  "Addition": "assets/gifs/addition.gif",
  "Subtraction": "assets/gifs/subtraction.gif",
  "Multiplication": "assets/gifs/multiplication.gif",
  "Division": "assets/gifs/division.gif",
  "Even Numbers": "assets/gifs/evennumbers.gif",
  "Odd Numbers": "assets/gifs/oddnumbers.gif",
  "Prime Numbers": "assets/gifs/primenumbers.gif",
  "Perfect Squares": "assets/gifs/perfectsquare.gif",
  "Doubling": "assets/gifs/doubling.gif",
  "Halving": "assets/gifs/halving.gif",
  "Counting": "assets/gifs/counting.gif",
  "Skip Counting by 2": "assets/gifs/skipcountingby2.gif",
  "Skip Counting by 5": "assets/gifs/skipcountingby5.gif",
  "Number Bonds": "assets/gifs/numberbonds.gif",
  "Commutative Property (Add)": "assets/gifs/commutativepropertyadd.gif",
  "Commutative Property (Multiply)": "assets/gifs/commutativepropertymultiply.gif",
  "Associative Property": "assets/gifs/associativeproperty.gif",
  "Distributive Property": "assets/gifs/distributiveproperty.gif",
  "Identity Property (Add)": "assets/gifs/identitypropertyadd.gif",
  "Identity Property (Multiply)": "assets/gifs/identitypropertymultiply.gif",
  "Zero Property": "assets/gifs/zeroproperty.gif",
  "Greater Than": "assets/gifs/greaterthan.gif",
  "Less Than": "assets/gifs/lessthan.gif",
  "Equal To": "assets/gifs/equalto.gif",
  "Not Equal To": "assets/gifs/notequalto.gif",
  "Number Line": "assets/gifs/numberline.gif",
  "Ordinal Numbers": "assets/gifs/ordinalnumbers.gif",
  "Place Value": "assets/gifs/placevalue.gif",
  "Rounding": "assets/gifs/rounding.gif",
  "Estimation": "assets/gifs/estimation.gif",
  "Tally Marks": "assets/gifs/tallymarks.gif",
  "Patterns": "assets/gifs/patterns.gif",
  "Calendar Reading": "assets/gifs/calendarreading.gif",
  "Clock Reading": "assets/gifs/clockreading.gif",
  "Money Recognition": "assets/gifs/moneyrecognition.gif",
  "Basic Fractions": "assets/gifs/basicfractions.gif",
  "Shapes": "assets/gifs/shapes.gif",
  "Solid Shapes": "assets/gifs/solidshapes.gif",
  "Symmetry": "assets/gifs/symmetry.gif",
  "Measurement": "assets/gifs/measurement.gif",
  "Weight": "assets/gifs/weight.gif",
  "Volume": "assets/gifs/volume.gif",
  "Temperature": "assets/gifs/temperature.gif",
  "Time": "assets/gifs/time.gif",
  "Days in a Week": "assets/gifs/daysinaweek.gif",
  "Months in a Year": "assets/gifs/monthsinayear.gif",
  "Seasons": "assets/gifs/seasons.gif",
  "Data/Bar Graph": "assets/gifs/databarcharts.gif",
  "Probability": "assets/gifs/probability.gif",
  "Venn Diagram": "assets/gifs/venndiagram.gif",
  "Addition with Regrouping": "assets/gifs/additionwithregrouping.gif",
  "Subtraction with Regrouping": "assets/gifs/subtractionwithregrouping.gif",
  "Skip Counting by 10": "assets/gifs/skipcountingby10.gif",
  "Time: Half Hour": "assets/gifs/timehalfhour.gif",
  "Time: Quarter Hour": "assets/gifs/timequarterhour.gif",
  "Expanded Form": "assets/gifs/expandedform.gif",
  "Word Problem (Add)": "assets/gifs/wordproblemadd.gif",
  "Word Problem (Subtract)": "assets/gifs/wordproblemsubtract.gif",
  "Fact Family": "assets/gifs/factfamily.gif",
  "Comparing Numbers": "assets/gifs/comparingnumbers.gif",
  "Skip Counting by 3": "assets/gifs/skipcountingby3.gif",
  "Repeating Patterns": "assets/gifs/repeatingpatterns.gif",
  "Simple Equation": "assets/gifs/simpleequation.gif",

  // Visuals for intermediate patterns
  "Square of Sum": "assets/gifs/squareofsum.gif",
  "Square of Difference": "assets/gifs/squareofdifference.gif",
  "Sum of Squares": "assets/gifs/sumofsquares.gif",
  "Cube of Sum": "assets/gifs/cubeofsum.mp4",
  "Cube of Difference": "assets/gifs/cubeofdifference.mp4",
  "Fourth Power of Sum": "assets/gifs/fourthpowerofsum.gif",
  "Product of Powers Rule": "assets/gifs/productofpowerrules.gif",
  "Power of Product Rule": "assets/gifs/powerofproductrule.gif",
  "Power of Power Rule": "assets/gifs/powerofpowerrule.gif",
  "Algebraic Identity Expansion": "assets/gifs/algebraicidentityexpansion.gif",
  "Perimeter of Rectangle": "assets/gifs/perimeterofrectangle.gif",
  "Area of Rectangle": "assets/gifs/areaofrectangle.gif",
  "Area of Square": "assets/gifs/areaofsquare.gif",
  "Perimeter of Square": "assets/gifs/perimeterofsquare.gif",
  "Area of Triangle": "assets/gifs/areaoftriangle.gif",
  "Area of Trapezoid": "assets/gifs/areaoftrapezoid.gif",
  "Area of Circle": "assets/gifs/areaofcircle.gif",
  "Circumference of Circle": "assets/gifs/circumferenceofcircle.gif",
  "Surface Area of Cube": "assets/gifs/surfaceareaofcube.gif",
  "Volume of Cube": "assets/gifs/volumeofcube.gif",
  "Curved Surface Area of Cylinder": "assets/gifs/curvedsurfaceareacylinder.gif",
  "Total Surface Area of Cylinder": "assets/gifs/totalsurfaceareacylinder.gif",
  "Volume of Cylinder": "assets/gifs/volumeofcylinder.gif",
  "Surface Area of Cone": "assets/gifs/surfaceareaofcone.gif",
  "Volume of Cone": "assets/gifs/volumeofcone.gif",
  "Surface Area of Sphere": "assets/gifs/surfaceareaofsphere.gif",
  "Volume of Sphere": "assets/gifs/volumeofsphere.gif",
  "Simple Probability": "assets/gifs/simpleprobability.gif",
  "Addition of Fractions": "assets/gifs/additionoffractions.gif",
  "Multiplication of Fractions": "assets/gifs/multiplicationoffractions.gif",
  "Division of Fractions": "assets/gifs/divisionoffractions.gif",
  "Percentage Formula": "assets/gifs/percentageformula.gif",
  "Distance Formula": "assets/gifs/distanceformula.gif",
  "Slope Formula": "assets/gifs/slopeformula.gif",
  "Midpoint Formula": "assets/gifs/midpointformula.gif",
  "Pythagorean Theorem": "assets/gifs/pythagoreantheorem.gif",
  "Quadratic Formula": "assets/gifs/quadraticformula.gif",
  "Sine Ratio": "assets/gifs/sineratio.gif",
  "Cosine Ratio": "assets/gifs/cosineratio.gif",
  "Tangent Ratio": "assets/gifs/tangentratio.gif",
  "Laws of Exponents": "assets/gifs/lawsofexponents.gif",
  "Exponent Zero Rule": "assets/gifs/exponentzerorule.gif",
  "Negative Exponent Rule": "assets/gifs/negativeexponentrule.gif",
  "Simple Interest": "assets/gifs/simpleinterest.gif",
  "Compound Interest": "assets/gifs/compoundinterest.gif",
  "Slope-Intercept Form": "assets/gifs/Slope-Intercept Form.mp4",
  "Point-Slope Form": "assets/gifs/pointslopeform.gif",
  "Equation of Circle": "assets/gifs/equationofcircle.gif",
  "Volume of Prism": "assets/gifs/volumeofprism.gif",
  "Volume of Pyramid": "assets/gifs/volumeofpyramid.gif",
  "Area of Rhombus": "assets/gifs/areaofrhombus.gif",
  "Area of Parallelogram": "assets/gifs/areaofparallelogram.gif",
  "Product Rule for Derivatives": "assets/gifs/productruleforderivatives.gif",
  "Quotient Rule for Derivatives": "assets/gifs/quotientruleforderivatives.gif",
  "Chain Rule": "assets/gifs/chainruleforderivatives.gif",
  "Arithmetic Sequence Formula": "assets/gifs/arithmeticsequenceformula.gif",
  "Geometric Sequence Formula": "assets/gifs/geometricsequenceformula.gif",
  "Sum of Arithmetic Series": "assets/gifs/sumofarithmeticseries.gif",
  "Sum of Geometric Series": "assets/gifs/sumofgeometricseries.gif",
};
let synth = null;
let scheduledEvents = [];


window.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const userStatus = document.getElementById('user-status');
  const playBtn = document.getElementById('play-btn');
  const stopBtn = document.createElement('button');
stopBtn.textContent = '🛑 Stop Melody';
stopBtn.style.marginTop = '1rem';
document.querySelector('.container').appendChild(stopBtn);
  const patternSelect = document.getElementById('pattern-select');
  const forgotPasswordLink = document.getElementById('forgot-password');
  const showPasswordToggle = document.getElementById('show-password');
  const imgEl = document.createElement('img');
imgEl.id = 'patternGif';
imgEl.width = 400;
imgEl.height = 400;
imgEl.style.marginTop = '1rem';
imgEl.style.border = '1px solid #ccc';
imgEl.style.display = 'none';

const videoEl = document.createElement('video');
videoEl.id = 'patternVideo';
videoEl.width = 400;
videoEl.height = 400;
videoEl.autoplay = true;
videoEl.loop = true;
videoEl.muted = true;
videoEl.style.marginTop = '1rem';
videoEl.style.border = '1px solid #ccc';
videoEl.style.display = 'none';

document.querySelector('.container').appendChild(imgEl);
document.querySelector('.container').appendChild(videoEl);

const closeVisualBtn = document.createElement("button");
closeVisualBtn.textContent = "❌ Hide Visual";
closeVisualBtn.style.marginTop = "1rem";
closeVisualBtn.style.display = "none"; // Hide at first
document.querySelector(".container").appendChild(closeVisualBtn);

closeVisualBtn.addEventListener("click", () => {
  const gif = document.getElementById("patternGif");
  const video = document.getElementById("patternVideo");

  if (gif) gif.style.display = "none";
  if (video) video.style.display = "none";

  // Also hide the button itself
  closeVisualBtn.style.display = "none";
});


  const beginnerPatterns = [
    { name: "Addition", example: "1 + 1 = 2" },
    { name: "Subtraction", example: "5 - 2 = 3" },
    { name: "Multiplication", example: "2 × 3 = 6" },
    { name: "Division", example: "8 ÷ 2 = 4" },
    { name: "Even Numbers", example: "2, 4, 6, 8, 10" },
    { name: "Odd Numbers", example: "1, 3, 5, 7, 9" },
    { name: "Prime Numbers", example: "2, 3, 5, 7, 11" },
    { name: "Perfect Squares", example: "1, 4, 9, 16, 25" },
    { name: "Doubling", example: "Double of 3 is 6" },
    { name: "Halving", example: "Half of 10 is 5" },
    { name: "Counting", example: "1, 2, 3, 4, 5" },
    { name: "Skip Counting by 2", example: "2, 4, 6, 8, 10" },
    { name: "Skip Counting by 5", example: "5, 10, 15, 20" },
    { name: "Number Bonds", example: "4 + 6 = 10" },
    { name: "Commutative Property (Add)", example: "2 + 3 = 3 + 2" },
    { name: "Commutative Property (Multiply)", example: "4 × 5 = 5 × 4" },
    { name: "Associative Property", example: "(2 + 3) + 4 = 2 + (3 + 4)" },
    { name: "Distributive Property", example: "2 × (3 + 4) = 2×3 + 2×4" },
    { name: "Identity Property (Add)", example: "7 + 0 = 7" },
    { name: "Identity Property (Multiply)", example: "7 × 1 = 7" },
    { name: "Zero Property", example: "0 × 5 = 0" },
    { name: "Greater Than", example: "5 > 3" },
    { name: "Less Than", example: "2 < 6" },
    { name: "Equal To", example: "4 = 4" },
    { name: "Not Equal To", example: "7 ≠ 5" },
    { name: "Number Line", example: "0 — 1 — 2 — 3" },
    { name: "Ordinal Numbers", example: "1st, 2nd, 3rd" },
    { name: "Place Value", example: "In 42, 4 is tens, 2 is ones" },
    { name: "Rounding", example: "Round 43 to 40" },
    { name: "Estimation", example: "Estimate 19 + 21 ≈ 40" },
    { name: "Tally Marks", example: "|||| = 4" },
    { name: "Patterns", example: "Red, Blue, Red, Blue..." },
    { name: "Calendar Reading", example: "Monday, Tuesday, Wednesday..." },
    { name: "Clock Reading", example: "Short hand at 3 = 3 o'clock" },
    { name: "Money Recognition", example: "1 dime = 10 cents" },
    { name: "Basic Fractions", example: "1/2 of a circle" },
    { name: "Shapes", example: "A triangle has 3 sides" },
    { name: "Solid Shapes", example: "Cube has 6 faces" },
    { name: "Symmetry", example: "A square has 4 lines of symmetry" },
    { name: "Measurement", example: "12 inches = 1 foot" },
    { name: "Weight", example: "1 kg = 1000 grams" },
    { name: "Volume", example: "1 liter = 1000 milliliters" },
    { name: "Temperature", example: "Water freezes at 0°C" },
    { name: "Time", example: "60 minutes = 1 hour" },
    { name: "Days in a Week", example: "There are 7 days in a week" },
    { name: "Months in a Year", example: "12 months in a year" },
    { name: "Seasons", example: "Spring, Summer, Fall, Winter" },
    { name: "Data/Bar Graph", example: "Bar A = 5 votes, Bar B = 3 votes" },
    { name: "Probability", example: "Coin flip: Heads or Tails" },
    { name: "Venn Diagram", example: "Apples ∩ Red Fruits = Red Apples" },
    { name: "Addition with Regrouping", example: "27 + 15 = 42" },
    { name: "Subtraction with Regrouping", example: "42 - 19 = 23" },
    { name: "Skip Counting by 10", example: "10, 20, 30, 40" },
    { name: "Time: Half Hour", example: "3:30 means half past 3" },
    { name: "Time: Quarter Hour", example: "7:15 means quarter past 7" },
    { name: "Expanded Form", example: "253 = 200 + 50 + 3" },
    { name: "Word Problem (Add)", example: "Sally has 2 apples and gets 3 more" },
    { name: "Word Problem (Subtract)", example: "Tom had 5 candies, ate 2" },
    { name: "Fact Family", example: "3 + 4 = 7, 7 - 3 = 4" },
    { name: "Comparing Numbers", example: "12 is more than 8" },
    { name: "Skip Counting by 3", example: "3, 6, 9, 12" },
    { name: "Repeating Patterns", example: "A, B, A, B" },
    { name: "Simple Equation", example: "x + 2 = 4" }
  ];
  const intermediatePatterns = [
    { name: "Square of Sum", example: "(a + b)^2 = a^2 + 2ab + b^2" },
    { name: "Square of Difference", example: "(a - b)^2 = a^2 - 2ab + b^2" },
    { name: "Sum of Squares", example: "a^2 + b^2 = (a + b)^2 - 2ab" },
    { name: "Cube of Sum", example: "(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3" },
    { name: "Cube of Difference", example: "(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3" },
    { name: "Fourth Power of Sum", example: "(a + b)^4 = a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4" },
    { name: "Product of Powers Rule", example: "a^m × a^n = a^(m + n)" },
    { name: "Power of Product Rule", example: "(ab)^m = a^m × b^m" },
    { name: "Power of Power Rule", example: "(a^m)^n = a^(mn)" },
    { name: "Algebraic Identity Expansion", example: "(a + b + c)^2 = a^2 + b^2 + c^2 + 2ab + 2bc + 2ca" },
    { name: "Perimeter of Rectangle", example: "2(l + b)" },
    { name: "Area of Rectangle", example: "l × b" },
    { name: "Area of Square", example: "a^2" },
    { name: "Perimeter of Square", example: "4a" },
    { name: "Area of Triangle", example: "½ × b × h" },
    { name: "Area of Trapezoid", example: "½ × (b1 + b2) × h" },
    { name: "Area of Circle", example: "πr^2" },
    { name: "Circumference of Circle", example: "2πr" },
    { name: "Surface Area of Cube", example: "6a^2" },
    { name: "Volume of Cube", example: "a^3" },
    { name: "Curved Surface Area of Cylinder", example: "2πrh" },
    { name: "Total Surface Area of Cylinder", example: "2πr(r + h)" },
    { name: "Volume of Cylinder", example: "πr^2h" },
    { name: "Surface Area of Cone", example: "πr(r + l)" },
    { name: "Volume of Cone", example: "⅓πr^2h" },
    { name: "Surface Area of Sphere", example: "4πr^2" },
    { name: "Volume of Sphere", example: "⁴⁄₃πr^3" },
    { name: "Simple Probability", example: "P(A) = n(A)/n(S)" },
    { name: "Addition of Fractions", example: "a/b + c/d = (ad + bc)/bd" },
    { name: "Multiplication of Fractions", example: "a/b × c/d = (a×c)/(b×d)" },
    { name: "Division of Fractions", example: "a/b ÷ c/d = (a×d)/(b×c)" },
    { name: "Percentage Formula", example: "(Value/Total) × 100" },
    { name: "Distance Formula", example: "√[(x2 − x1)^2 + (y2 − y1)^2]" },
    { name: "Slope Formula", example: "(y2 − y1)/(x2 − x1)" },
    { name: "Midpoint Formula", example: "((x1 + x2)/2, (y1 + y2)/2)" },
    { name: "Pythagorean Theorem", example: "a^2 + b^2 = c^2" },
    { name: "Quadratic Formula", example: "x = [-b ± √(b^2 - 4ac)] / 2a" },
    { name: "Sine Ratio", example: "sin(θ) = Opposite/Hypotenuse" },
    { name: "Cosine Ratio", example: "cos(θ) = Adjacent/Hypotenuse" },
    { name: "Tangent Ratio", example: "tan(θ) = Opposite/Adjacent" },
    { name: "Laws of Exponents", example: "a^m / a^n = a^(m-n)" },
    { name: "Exponent Zero Rule", example: "a^0 = 1" },
    { name: "Negative Exponent Rule", example: "a^-n = 1/a^n" },
    { name: "Simple Interest", example: "SI = (P×R×T)/100" },
    { name: "Compound Interest", example: "CI = P(1 + R/100)^T - P" },
    { name: "Slope-Intercept Form", example: "y = mx + c" },
    { name: "Point-Slope Form", example: "y - y1 = m(x - x1)" },
    { name: "Equation of Circle", example: "(x - h)^2 + (y - k)^2 = r^2" },
    { name: "Volume of Prism", example: "Base Area × Height" },
    { name: "Volume of Pyramid", example: "⅓ × Base Area × Height" },
    { name: "Area of Rhombus", example: "½ × d1 × d2" },
    { name: "Area of Parallelogram", example: "base × height" },
    { name: "Product Rule for Derivatives", example: "d(uv)/dx = u dv/dx + v du/dx" },
    { name: "Quotient Rule for Derivatives", example: "d(u/v)/dx = (v du - u dv)/v^2" },
    { name: "Chain Rule", example: "d/dx[f(g(x))] = f'(g(x)) × g'(x)" },
    { name: "Arithmetic Sequence Formula", example: "a_n = a + (n - 1)d" },
    { name: "Geometric Sequence Formula", example: "a_n = ar^(n - 1)" },
    { name: "Sum of Arithmetic Series", example: "S_n = n/2 × (2a + (n - 1)d)" },
    { name: "Sum of Geometric Series", example: "S_n = a(1 - r^n)/(1 - r)" }
  ];
  
  const advancedPatterns = [
    { name: "Euler's Formula", example: "e^{ix} = cos(x) + i·sin(x)" },
    { name: "Taylor Series", example: "f(x) = f(a) + f'(a)(x-a) + f''(a)(x-a)^2/2! + ..." },
    { name: "Maclaurin Series", example: "e^x = 1 + x + x^2/2! + x^3/3! + ..." },
    { name: "L'Hôpital's Rule", example: "lim f(x)/g(x) = lim f'(x)/g'(x)" },
    { name: "Implicit Differentiation", example: "d/dx [xy] = x·dy/dx + y" },
    { name: "Second Derivative Test", example: "f''(x)>0 → min, f''(x)<0 → max" },
    { name: "Logarithmic Differentiation", example: "d/dx [f(x)^g(x)] = ..." },
    { name: "Double Angle (Sine)", example: "sin(2x) = 2sin(x)cos(x)" },
    { name: "Double Angle (Cosine)", example: "cos(2x) = cos²(x) - sin²(x)" },
    { name: "Triple Angle Formula", example: "sin(3x) = 3sin(x) - 4sin³(x)" },
    { name: "Determinant of 2x2 Matrix", example: "ad - bc" },
    { name: "Cramer's Rule", example: "x = det(A_x)/det(A)" },
    { name: "Eigenvalues", example: "det(A - λI) = 0" },
    { name: "Matrix Inverse", example: "A⁻¹ = 1/det(A) · adj(A)" },
    { name: "Dot Product", example: "A·B = |A||B|cosθ" },
    { name: "Cross Product", example: "A×B = |A||B|sinθ·n" },
    { name: "Vector Magnitude", example: "|A| = √(x² + y² + z²)" },
    { name: "Gradient Vector", example: "∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z)" },
    { name: "Divergence", example: "∇·F = ∂F₁/∂x + ∂F₂/∂y + ∂F₃/∂z" },
    { name: "Curl of Vector Field", example: "∇×F = ..." },
    { name: "Laplace Transform", example: "L{f(t)} = ∫₀^∞ e^(-st)f(t)dt" },
    { name: "Fourier Series", example: "f(x) = a₀ + Σ aₙcos(nx) + bₙsin(nx)" },
    { name: "Limit Definition of Derivative", example: "f'(x) = lim h→0 (f(x+h)-f(x))/h" },
    { name: "FTC", example: "∫_a^b f'(x)dx = f(b) - f(a)" },
    { name: "Chain Rule (Multivariable)", example: "dz/dt = ∂z/∂x·dx/dt + ∂z/∂y·dy/dt" },
    { name: "2nd Order ODE", example: "y'' + p(x)y' + q(x)y = g(x)" },
    { name: "Homogeneous ODE", example: "dy/dx = F(y/x)" },
    { name: "Bernoulli ODE", example: "dy/dx + P(x)y = Q(x)y^n" },
    { name: "Separable Variables", example: "dy/dx = g(x)h(y)" },
    { name: "Binomial Theorem", example: "(a + b)^n = Σ nCk·a^(n-k)·b^k" },
    { name: "Mean Value Theorem", example: "f'(c) = (f(b)-f(a))/(b-a)" },
    { name: "Rolle's Theorem", example: "If f(a) = f(b), ∃ c: f'(c) = 0" },
    { name: "Polar → Rectangular", example: "x = r cosθ, y = r sinθ" },
    { name: "Rectangular → Polar", example: "r = √(x² + y²), θ = tan⁻¹(y/x)" },
    { name: "Parabola Equation", example: "y² = 4ax" },
    { name: "Ellipse Equation", example: "x²/a² + y²/b² = 1" },
    { name: "Hyperbola Equation", example: "x²/a² - y²/b² = 1" },
    { name: "Binomial Probability", example: "P(X=k) = nCk p^k (1-p)^(n-k)" },
    { name: "Poisson Distribution", example: "P(k) = (λ^k e^(-λ)) / k!" },
    { name: "Z-score", example: "z = (x - μ)/σ" },
    { name: "Variance", example: "Var(X) = E[X²] - (E[X])²" },
    { name: "Standard Deviation", example: "σ = √Var(X)" },
    { name: "Covariance", example: "Cov(X,Y) = E[(X-μx)(Y-μy)]" },
    { name: "Correlation Coefficient", example: "r = Cov(X,Y)/(σxσy)" },
    { name: "Bayes' Theorem", example: "P(A|B) = P(B|A)·P(A)/P(B)" },
    { name: "Permutation", example: "nPr = n! / (n - r)!" },
    { name: "Combination", example: "nCr = n! / [r!(n - r)!]" },
    { name: "Expected Value", example: "E(X) = Σ [x·P(x)]" },
    { name: "Partial Derivative", example: "∂f/∂x" },
    { name: "Double Integral", example: "∬ f(x,y) dA" },
    { name: "Triple Integral", example: "∭ f(x,y,z) dV" },
    { name: "Jacobian Determinant", example: "J = ∂(x,y)/∂(u,v)" },
    { name: "Parametric Equations", example: "x = f(t), y = g(t)" },
    { name: "Lagrange Interpolation", example: "P(x) = Σ y_i·L_i(x)" },
    { name: "Newton's Divided Difference", example: "f[x0,x1] = (f(x1)-f(x0))/(x1-x0)" },
    { name: "Gradient Descent", example: "x := x - η∇f(x)" },
    { name: "Fourier Transform", example: "F(ω) = ∫ f(t)e^(-iωt) dt" },
    { name: "Complex Number", example: "z = a + bi" },
    { name: "Modulus of Complex", example: "|z| = √(a² + b²)" }
  ];
  
  
  const saveBtn = document.createElement('button');
  saveBtn.textContent = '❤️ Save Melody';
  saveBtn.style.marginTop = '1rem';
  document.querySelector('.container').appendChild(saveBtn);

  const viewSavedBtn = document.createElement('button');
  viewSavedBtn.textContent = '📂 View My Saved Melodies';
  viewSavedBtn.style.marginTop = '1rem';
  document.querySelector('.container').appendChild(viewSavedBtn);

  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = '📕 Log Out';
  logoutBtn.style.marginTop = '1rem';
  document.querySelector('.container').appendChild(logoutBtn);

 const output = document.createElement('div');
output.id = 'saved-output'; // ✅ Add ID to make it accessible
output.style.marginTop = '1rem';
document.querySelector('.container').appendChild(output);


  if (window.innerWidth < 768) {
    authContainer.classList.add("collapsed");
    toggleAuthBtn.textContent = "🔽 Show Login";
    document.body.style.paddingTop = "40px";
    authVisible = false;
  }
  

  showPasswordToggle.addEventListener('change', () => {
    passwordInput.type = showPasswordToggle.checked ? 'text' : 'password';
  });

  signupBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        userStatus.textContent = `Signed up as: ${userCredential.user.email}`;
      })
      .catch(error => alert("Signup error: " + error.message));
  });

  loginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        userStatus.textContent = `Logged in as: ${userCredential.user.email}`;
      })
      .catch(error => alert("Login error: " + error.message));
  });

  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    if (!email) return alert("Please enter your email first.");
    sendPasswordResetEmail(auth, email)
      .then(() => alert("📧 Password reset email sent! Check your inbox."))
      .catch(error => alert("Reset error: " + error.message));
  });

  onAuthStateChanged(auth, user => {
    userStatus.textContent = user ? `Logged in as: ${user.email}` : "Not logged in";
  });

  logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
      alert('Logged out.');
      userStatus.textContent = "Not logged in";
    });
  });

  function createInstrument(type) {
    const settings = {
      Synth: { envelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.8 } },
      FMSynth: { envelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 1 } },
      AMSynth: { envelope: { attack: 0.08, decay: 0.2, sustain: 0.4, release: 0.8 } },
      DuoSynth: {
        voice0: { envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1 } },
        voice1: { envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1 } }
      },
      MembraneSynth: { envelope: { attack: 0.05, decay: 0.3, sustain: 0.2, release: 0.5 } },
      MetalSynth: { envelope: { attack: 0.01, decay: 1.2, release: 1.2 } },
      PluckSynth: {}
    };
    const constructor = Tone[type];
    const config = settings[type] || {};
    return new constructor(config).toDestination();
  }
let lastPlayed = null;

saveBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to save melodies.");
    return;
  }

  if (!lastPlayed || !lastPlayed.pattern || !lastPlayed.notes) {
    alert("Please play a pattern first before saving.");
    return;
  }

  try {
    const favoritesRef = collection(db, "users", user.uid, "favorites");

    // Check if the melody already exists
    const existing = await getDocs(query(favoritesRef, where("pattern", "==", lastPlayed.pattern)));
    if (!existing.empty) {
      alert("❗This melody is already saved.");
      return;
    }

    await addDoc(favoritesRef, {
      pattern: lastPlayed.pattern,
      notes: lastPlayed.notes,
      createdAt: new Date()
    });

    alert("✅ Melody saved successfully!");
  } catch (err) {
    console.error("Save error:", err);
    alert("❌ Failed to save melody.");
  }
});

playBtn.addEventListener('click', async () => {
  const selected = patternSelect.value;
  const level = levelSelect.value;

  console.log("🔊 Selected pattern:", selected);

  let melodyData;
  if (level === "beginner") {
    melodyData = patternNoteMap[selected];
  } else if (level === "intermediate") {
    melodyData = patternNoteMapIntermediate[selected];
  } else if (level === "advanced") {
    melodyData = patternNoteMapAdvanced[selected];
  }

  if (!melodyData || !melodyData.notes || melodyData.notes.length === 0) {
    alert("❌ No melody available for this pattern.");
    return;
  }

  let synth;

if (level === "beginner") {
  const chorus = new Tone.Chorus(5, 2.5, 0.3).start(); // shimmer
  const delay = new Tone.PingPongDelay("8n", 0.2).toDestination();
  const shiftedNotes = melodyData.notes.map(note =>
  note === "Rest" ? "Rest" : note.replace(/(\d)/, (_, num) => parseInt(num) + 1)
);

  const whistleSynth = new Tone.FMSynth({
    modulationIndex: 15,
    harmonicity: 8,
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.01,
      decay: 0.3,
      sustain: 0.4,
      release: 0.3
    },
    modulation: { type: "square" },
    modulationEnvelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.3,
      release: 0.1
    }
  });

  synth = whistleSynth.connect(chorus).connect(delay);
  } else if (level === "intermediate") {
    const filter = new Tone.Filter(1000, "lowpass");
    const reverb = new Tone.Reverb({ decay: 2.5, preDelay: 0.2 }).toDestination();
    await reverb.generate();
    synth = new Tone.Synth({
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.6 }
    }).connect(filter).connect(reverb);
  } else if (level === "advanced") {
    const distortion = new Tone.Distortion(0.3); // softened for clarity
    const pitchShift = new Tone.PitchShift({ pitch: -3 });
    const reverb = new Tone.Reverb({ decay: 4 }).toDestination();
    await reverb.generate();
    synth = new Tone.DuoSynth({
      voice0: { envelope: { release: 1 } },
      voice1: { envelope: { release: 1 } }
    }).connect(distortion).connect(pitchShift).connect(reverb);
  }

  const now = Tone.now();
  const timeGap = 0.25;
  const noteLength = "4n";
  const repeat = 8;

Tone.Transport.stop();
Tone.Transport.cancel();
scheduledEvents = [];

for (let r = 0; r < repeat; r++) {
  melodyData.notes.forEach((note, i) => {
    if (note === "Rest") return;
    const time = now + (r * melodyData.notes.length + i) * timeGap;

    const relativeTime = `+${(r * melodyData.notes.length + i) * timeGap}`;
const eventId = Tone.Transport.schedule(() => {
  synth.triggerAttackRelease(note, noteLength);
}, relativeTime);

    scheduledEvents.push(eventId);
  });
}

Tone.Transport.start();


  lastPlayed = {
    pattern: selected,
    notes: melodyData.notes
  };

// 🎥 VISUAL DISPLAY LOGIC
  const gif = document.getElementById('patternGif');
  const video = document.getElementById('patternVideo');
  const visualSrc = patternVisualMap[selected];

  // Hide both by default
  gif.style.display = 'none';
  video.style.display = 'none';

  if (visualSrc) {
    if (visualSrc.endsWith('.gif')) {
      gif.src = visualSrc;
      gif.style.display = 'block';
    } else if (visualSrc.endsWith('.mp4') || visualSrc.endsWith('.webm')) {
      video.src = visualSrc;
      video.style.display = 'block';
    }
  }

// Show the close button after visuals are updated
closeVisualBtn.style.display = "inline-block";

});

stopBtn.addEventListener('click', () => {
  Tone.Transport.stop(); // stop playback
scheduledEvents.forEach(id => Tone.Transport.clear(id)); // clear events
scheduledEvents = []; // reset
console.log("🛑 Melody stopped.");


  console.log("🛑 Melody stopped.");
});

  viewSavedBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) return alert("Please log in to view your melodies.");

  try {
    const favoritesRef = collection(db, "users", user.uid, "favorites");
    const querySnapshot = await getDocs(favoritesRef);

    let html = '<h3>🎶 Your Saved Melodies:</h3>';
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      html += `<p><strong>${data.pattern}:</strong> ${data.notes.join(', ')} 
        <button style="margin-left:10px;font-size:0.8rem" onclick="deleteFavorite('${docSnap.id}')">🗑️</button></p>`;
    });

    html += `<button style="margin-top:0.2rem;" onclick="document.getElementById('saved-output').innerHTML = ''">❌ Close</button>`;
output.innerHTML = html;
  } catch (e) {
    console.error("View error:", e);
    alert("❌ Failed to load saved melodies.");
  }
});
  window.deleteFavorite = async (docId) => {
  const user = auth.currentUser;
  if (!user) return alert("Please log in.");

  try {
    const docRef = doc(db, "users", user.uid, "favorites", docId);
    await deleteDoc(docRef);
    alert("🗑️ Melody removed.");
    viewSavedBtn.click(); // Refresh list
  } catch (e) {
    console.error("Delete error:", e);
    alert("❌ Failed to delete melody.");
  }
};

  const levelSelect = document.getElementById('level-select');
const authUI = document.querySelector('.auth-ui');
const mainUI = document.querySelector('.main-ui');

levelSelect.addEventListener("change", (e) => {
  const level = e.target.value;
  document.body.className = level;

  if (level === "home") {
    authUI.style.display = "flex";
    mainUI.style.display = "none";
  } else {
    authUI.style.display = "none";
    mainUI.style.display = "flex";
  }

  // Clear previous dropdown options
  patternSelect.innerHTML = "";

  if (level === "beginner") {
    beginnerPatterns.forEach(p => {
      const option = document.createElement("option");
      option.value = p.name;
      option.textContent = p.name;
      patternSelect.appendChild(option);
    });
  }

  if (level === "intermediate") {
    intermediatePatterns.forEach(p => {
      const option = document.createElement("option");
      option.value = p.name;
      option.textContent = p.name;
      patternSelect.appendChild(option);
    });
  }

  if (level === "advanced") {
    advancedPatterns.forEach(p => {
      const option = document.createElement("option");
      option.value = p.name;
      option.textContent = p.name;
      patternSelect.appendChild(option);
    });
  }
});
});


