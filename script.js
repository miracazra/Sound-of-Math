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

window.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const userStatus = document.getElementById('user-status');
  const playBtn = document.getElementById('play-btn');
  const patternSelect = document.getElementById('pattern-select');
  const forgotPasswordLink = document.getElementById('forgot-password');
  const showPasswordToggle = document.getElementById('show-password');

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
  output.style.marginTop = '1rem';
  document.querySelector('.container').appendChild(output);

  const canvas = document.createElement('canvas');
  canvas.id = 'spiralCanvas';
  canvas.width = 400;
  canvas.height = 400;
  canvas.style.marginTop = '1rem';
  canvas.style.border = '1px solid #ccc';
  document.querySelector('.container').appendChild(canvas);
  const ctx = canvas.getContext('2d');

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

  const synth = new Tone.Synth({ oscillator: { type: 'sine' } }).toDestination();
  const patterns = {
    squares: () => [1, 4, 9, 16, 25, 36],
    fibonacci: () => [1, 1, 2, 3, 5, 8, 13],
    primes: () => [2, 3, 5, 7, 11, 13, 17]
  };

  function mapToNotes(numbers) {
    const baseNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'];
    return numbers.map(n => baseNotes[n % baseNotes.length]);
  }

  function drawFibonacciSpiral() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let angle = 0;
    let scale = 3;

    const sequence = patterns.fibonacci();
    sequence.forEach((val, i) => {
      let radius = val * scale;
      let cx = x + radius * Math.cos(angle);
      let cy = y + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
      ctx.fillStyle = `hsl(${i * 40}, 70%, 60%)`;
      ctx.fill();
      angle += 0.9;
    });
  }

  let lastPlayed = { pattern: '', notes: [] };

  playBtn.addEventListener('click', async () => {
    await Tone.start();
    const selected = patternSelect.value;
    const numberPattern = patterns[selected]();
    const notes = mapToNotes(numberPattern);
    notes.forEach((note, i) => synth.triggerAttackRelease(note, '8n', Tone.now() + i * 0.5));
    lastPlayed = { pattern: selected, notes };
    if (selected === 'fibonacci') drawFibonacciSpiral();
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  saveBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please log in to save melodies.");
    if (!lastPlayed.pattern || lastPlayed.notes.length === 0) return alert("Play a melody first!");

    const q = query(collection(db, "favorites"), where("uid", "==", user.uid), where("pattern", "==", lastPlayed.pattern));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) return alert("This pattern is already saved.");

    try {
      await addDoc(collection(db, "favorites"), {
        uid: user.uid,
        pattern: lastPlayed.pattern,
        notes: lastPlayed.notes,
        timestamp: Date.now()
      });
      alert("🎵 Melody saved!");
    } catch (e) {
      console.error("Save error:", e);
    }
  });

  viewSavedBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please log in to view your melodies.");

    try {
      const q = query(collection(db, "favorites"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      let html = '<h3>🎶 Your Saved Melodies:</h3>';
      querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        html += `<p><strong>${data.pattern}:</strong> ${data.notes.join(', ')} <button style="margin-left:10px;font-size:0.8rem" onclick="deleteFavorite('${docSnap.id}')">🗑️</button></p>`;
      });
      output.innerHTML = html;
    } catch (e) {
      console.error("View error:", e);
    }
  });

  window.deleteFavorite = async (docId) => {
    try {
      await deleteDoc(doc(db, "favorites", docId));
      alert("🗑️ Melody removed.");
      viewSavedBtn.click();
    } catch (e) {
      console.error("Delete error:", e);
    }
  };
  const levelSelect = document.getElementById('level-select');

  levelSelect.addEventListener("change", (e) => {
    const level = e.target.value;
    document.body.className = level; // changes body class to apply theme
  });
  
  
});
