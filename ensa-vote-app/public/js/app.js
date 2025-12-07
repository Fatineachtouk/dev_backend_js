// Variable pour stocker l'utilisateur connecté
let currentUser = null;

// PARTIE 1 : AUTHENTIFICATION


// Quand la page charge, vérifier si un utilisateur est connecté
auth.onAuthStateChanged(function(user) {
    if (user) {
        // Un utilisateur est connecté
        currentUser = user;
        showEventsSection();
        loadEvents();
    } else {
        // Personne n'est connecté
        currentUser = null;
        showAuthSection();
    }
});

// Fonction pour l'inscription
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Empêcher le rechargement de la page
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Vérifier que c'est un email ENSA Safi
    if (!email.endsWith('@uca.ac.ma')) {
        showMessage('Veuillez utiliser votre email ENSA Safi (@uca.ac.ma)', 'error');
        return;
    }
    
    // Créer le compte
    auth.createUserWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            showMessage('Compte créé avec succès !', 'success');
        })
        .catch(function(error) {
            showMessage('Erreur : ' + error.message, 'error');
        });
});

// Fonction pour la connexion
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Se connecter
    auth.signInWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            showMessage('Connexion réussie !', 'success');
        })
        .catch(function(error) {
            showMessage('Erreur : ' + error.message, 'error');
        });
});

// Fonction pour se déconnecter
function logout() {
    auth.signOut().then(function() {
        showMessage('Déconnexion réussie', 'success');
    });
}


// PARTIE 2 : AFFICHAGE DES ÉVÉNEMENTS


// Charger tous les événements depuis Firebase
function loadEvents() {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '<p>Chargement des événements...</p>';
    
    // Récupérer tous les événements
    db.collection('events').orderBy('date', 'asc').get()
        .then(function(querySnapshot) {
            eventsList.innerHTML = ''; // Vider la liste
            
            if (querySnapshot.empty) {
                eventsList.innerHTML = '<p>Aucun événement pour le moment.</p>';
                return;
            }
            
            // Pour chaque événement, créer une carte
            querySnapshot.forEach(function(doc) {
                const event = doc.data();
                event.id = doc.id;
                createEventCard(event);
            });
        })
        .catch(function(error) {
            eventsList.innerHTML = '<p>Erreur lors du chargement des événements.</p>';
            console.error('Erreur:', error);
        });
}

// Créer une carte pour un événement
function createEventCard(event) {
    const eventsList = document.getElementById('eventsList');
    
    // Formater la date
    const date = new Date(event.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Créer la carte HTML
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
        <img src="${event.img}" alt="${event.title}">
        <h3>${event.title}</h3>
        <p class="event-date"> ${formattedDate}</p>
        <p>${event.description}</p>
        <span class="event-price ${event.isFree ? '' : 'paid'}">
            ${event.isFree ? 'Gratuit' : event.Price + ' DH'}
        </span>
        
        <div class="vote-stats">
            <div class="vote-stat">
                <div class="number">${event.yesVotes || 0}</div>
                <div class="label"> OUI</div>
            </div>
            <div class="vote-stat">
                <div class="number">${event.noVotes || 0}</div>
                <div class="label"> NON</div>
            </div>
        </div>
        
        <div class="vote-buttons" id="vote-buttons-${event.id}">
            <button class="vote-btn yes" onclick="vote('${event.id}', 'yes')">Voter OUI</button>
            <button class="vote-btn no" onclick="vote('${event.id}', 'no')">Voter NON</button>
        </div>
    `;
    
    eventsList.appendChild(card);
    
    // Vérifier si l'utilisateur a déjà voté
    checkUserVote(event.id);
}

// PARTIE 3 : SYSTÈME DE VOTE


// Vérifier si l'utilisateur a déjà voté pour cet événement
function checkUserVote(eventId) {
    if (!currentUser) return;
    
    db.collection('votes')
        .where('eventId', '==', eventId)
        .where('userId', '==', currentUser.uid)
        .get()
        .then(function(querySnapshot) {
            if (!querySnapshot.empty) {
                // L'utilisateur a déjà voté
                const voteDoc = querySnapshot.docs[0];
                const userVote = voteDoc.data().vote;
                
                // Marquer le bouton sélectionné
                const buttonsDiv = document.getElementById('vote-buttons-' + eventId);
                const yesBtn = buttonsDiv.querySelector('.yes');
                const noBtn = buttonsDiv.querySelector('.no');
                
                if (userVote === 'yes') {
                    yesBtn.classList.add('selected');
                    yesBtn.disabled = true;
                    noBtn.disabled = true;
                } else {
                    noBtn.classList.add('selected');
                    yesBtn.disabled = true;
                    noBtn.disabled = true;
                }
            }
        });
}

// Fonction pour voter
function vote(eventId, voteType) {
    if (!currentUser) {
        alert('Vous devez être connecté pour voter !');
        return;
    }
    
    // Désactiver les boutons pendant le traitement
    const buttonsDiv = document.getElementById('vote-buttons-' + eventId);
    const buttons = buttonsDiv.querySelectorAll('.vote-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    // Vérifier si l'utilisateur a déjà voté
    db.collection('votes')
        .where('eventId', '==', eventId)
        .where('userId', '==', currentUser.uid)
        .get()
        .then(function(querySnapshot) {
            if (!querySnapshot.empty) {
                alert('Vous avez déjà voté pour cet événement !');
                buttons.forEach(btn => btn.disabled = true);
                return;
            }
            
            // Enregistrer le vote dans la collection "votes"
            return db.collection('votes').add({
                eventId: eventId,
                userId: currentUser.uid,
                vote: voteType,
                createdAt: new Date().toISOString()
            });
        })
        .then(function() {
            // Mettre à jour le compteur dans l'événement
            const eventRef = db.collection('events').doc(eventId);
            const fieldToUpdate = voteType === 'yes' ? 'yesVotes' : 'noVotes';
            
            return eventRef.update({
                [fieldToUpdate]: firebase.firestore.FieldValue.increment(1),
                updatedAt: new Date().toISOString()
            });
        })
        .then(function() {
            // Recharger les événements pour afficher les nouveaux compteurs
            loadEvents();
        })
        .catch(function(error) {
            console.error('Erreur lors du vote:', error);
            alert('Erreur lors du vote. Veuillez réessayer.');
            buttons.forEach(btn => btn.disabled = false);
        });
}


// Afficher la section d'authentification
function showAuthSection() {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('eventsSection').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
}

// Afficher la section des événements
function showEventsSection() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('eventsSection').style.display = 'block';
    document.getElementById('userInfo').style.display = 'block';
    document.getElementById('userEmail').textContent = currentUser.email;
}

// Afficher un message à l'utilisateur
function showMessage(message, type) {
    const messageDiv = document.getElementById('authMessage');
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
    
    // Masquer le message après 5 secondes
    setTimeout(function() {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 5000);
}