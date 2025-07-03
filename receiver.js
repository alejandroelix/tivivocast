const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

// Opciones de la aplicación (opcional pero útil)
const appOptions = new cast.framework.ApplicationOptions();
// appOptions.maxInactivity = 3600; // Ejemplo: mantener la sesión activa

// Listener para cuando la aplicación emisora envía metadatos al cargar contenido
playerManager.setMessageInterceptor(
    cast.framework.messages.MessageType.LOAD,
    loadRequestData => {
        console.log('LOAD request data:', loadRequestData);

        // Si no hay media, es posible que solo sean metadatos
        if (!loadRequestData.media) {
            return loadRequestData;
        }

        // Accede a los metadatos personalizados que envías desde Android
        const customData = loadRequestData.media.customData;
        const metadata = loadRequestData.media.metadata; // Metadatos estándar

        // Actualiza tu UI con la información
        document.getElementById('title').textContent = metadata.title || 'Sin título';
        document.getElementById('subtitle').textContent = metadata.subtitle || '';

        if (metadata.images && metadata.images.length > 0) {
            document.getElementById('poster-art').src = metadata.images[0].url;
        } else {
            document.getElementById('poster-art').style.display = 'none';
        }

        // Mostrar información adicional desde customData
        if (customData) {
            document.getElementById('description').textContent = customData.description || '';
            // Actualiza otros campos de customData aquí
            const additionalInfoDiv = document.getElementById('additional-metadata');
            additionalInfoDiv.innerHTML = ''; // Limpiar
            if(customData.genre) {
                const genreP = document.createElement('p');
                genreP.textContent = `Género: ${customData.genre}`;
                additionalInfoDiv.appendChild(genreP);
            }
            if(customData.actors && customData.actors.length > 0) {
                const actorsP = document.createElement('p');
                actorsP.textContent = `Actores: ${customData.actors.join(', ')}`;
                additionalInfoDiv.appendChild(actorsP);
            }
            // ... y así sucesivamente para otra información
        }
        return loadRequestData; // Siempre devuelve la solicitud (modificada o no)
    }
);

// Listener para cambios de estado (PLAYING, PAUSED, BUFFERING, IDLE)
playerManager.addEventListener(
    cast.framework.events.EventType.PLAYER_STATE_CHANGED,
    (event) => {
        console.log('Player State Changed: ', event.playerState);
        // Aquí puedes cambiar la UI basada en si se está reproduciendo, pausado, etc.
        // Por ejemplo, mostrar/ocultar tus propios controles personalizados.
        // Si estás usando <cast-media-player>, muchos controles ya están gestionados.
    }
);


// Inicia el contexto del receptor
context.start(appOptions);