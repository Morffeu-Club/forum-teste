	<script src="https://www.gstatic.com/firebasejs/9.8.1/firebase-app-compat.js"></script>
	<script src="https://www.gstatic.com/firebasejs/9.8.1/firebase-auth-compat.js"></script>
	<script src="https://www.gstatic.com/firebasejs/9.8.1/firebase-database-compat.js"></script>
	<script>
		const firebaseConfig = {
		    apiKey: "AIzaSyBZayS2B7JvmxX8pnaNJGbBnXP78U5Eq6I",
		    authDomain: "forum-teste-b771e.firebaseapp.com",
		    databaseURL: "https://forum-teste-b771e-default-rtdb.firebaseio.com",
		    projectId: "forum-teste-b771e",
		    storageBucket: "forum-teste-b771e.appspot.com",
		    messagingSenderId: "276889858845",
		    appId: "1:276889858845:web:b23bdd86955b3a2c09e7f4"
		};
		
		const app = firebase.initializeApp(firebaseConfig);
		const auth = firebase.auth();
		const db = firebase.database();
		
		let isAuthenticated = false;
		
		async function login(event) {
		    event.preventDefault();
		    const email = document.querySelector('input[name="email"]').value;
		    const password = document.querySelector('input[name="password"]').value;
		
		    try {
		        const userCredential = await auth.signInWithEmailAndPassword(email, password);
		        isAuthenticated = true;
		        document.getElementById('login-form').classList.add('hidden');
		        document.getElementById('post-form').classList.remove('hidden');
		        loadPosts();
		    } catch (error) {
		        const errorElement = document.getElementById('error-message');
		        errorElement.textContent = 'Usuário ou senha incorretos.';
		    }
		}
		
		async function postProduct(event) {
		    event.preventDefault();
		    if (!isAuthenticated) {
		        alert('Você precisa estar logado para postar.');
		        return;
		    }
		
		    const title = document.querySelector('input[name="title"]').value;
		    const description = document.querySelector('textarea[name="description"]').value;
		    const price = document.querySelector('input[name="price"]').value;
		    const imageUrl = document.querySelector('input[name="imageUrl"]').value;
		
		    try {
		        await db.ref('posts').push({
		            title,
		            description,
		            price,
		            imageUrl,
		            date: new Date().toISOString()
		        });
		        alert('Produto postado com sucesso!');
		        loadPosts();
		    } catch (error) {
		        alert('Erro ao postar produto.');
		    }
		}
		
		async function loadPosts() {
		    const postsContainer = document.getElementById('posts');
		    postsContainer.innerHTML = '';
		    
		    try {
		        const snapshot = await db.ref('posts').orderByChild('date').once('value');
		        snapshot.forEach((childSnapshot) => {
		            const post = childSnapshot.val();
		            const postElement = document.createElement('div');
		            postElement.className = 'post';
		            postElement.onclick = () => showDetails(post);
		            postElement.innerHTML = `
		                <img src="${post.imageUrl}" alt="${post.title}">
		                <h3>${post.title}</h3>
		                <p>Preço: ${post.price}</p>
		            `;
		            postsContainer.appendChild(postElement);
		        });
		    } catch (error) {
		        console.log("Erro ao carregar posts: ", error);
		    }
		}
		
		function showDetails(post) {
		    const detailsContainer = document.getElementById('product-details');
		    const detailsContent = document.getElementById('details-content');
		    detailsContent.innerHTML = `
		        <img src="${post.imageUrl}" alt="${post.title}">
		        <h3>${post.title}</h3>
		        <p>${post.description}</p>
		        <p>Preço: ${post.price}</p>
		        <p>Data: ${new Date(post.date).toLocaleDateString()}</p>
		    `;
		    detailsContainer.classList.remove('hidden');
		    document.getElementById('posts').classList.add('hidden');
		}
		
		function closeDetails() {
		    document.getElementById('product-details').classList.add('hidden');
		    document.getElementById('posts').classList.remove('hidden');
		}
		
		document.addEventListener('DOMContentLoaded', loadPosts);
	</script>