const apiUrl = 'http://192.168.1.101:8080/api/publicacion'; // Reemplaza con la URL de tu API

document.addEventListener('DOMContentLoaded', () => {
  const postContent = document.getElementById('post-content');
  const headerTitle = document.querySelector('header h1');

  // Obtener y mostrar la publicación completa y los comentarios
  fetchPostAndComments();

  async function fetchPostAndComments() {
    try {
      const postId = getPostIdFromUrl();
      console.log(getPostIdFromUrl());
      const postResponse = await fetch(`http://192.168.1.101:8080/api/publicacion/${postId}`);
      const postData = await postResponse.json();
  
      // Mostrar el título de la publicación en  el header
      document.querySelector('header h1').textContent = postData.titulo;
  
      displayPost(postData);
    } catch (error) {
      console.error('Error al obtener la publicación:', error);
    }
  }

  const inicioButton = document.getElementById('inicioButton');
  inicioButton.addEventListener('click', () => {
    // Redirigir a la página principal (ajusta la URL según sea necesario)
    window.location.href = 'http://192.168.1.66:8080/';
  });

  

  function displayPost(post) {
    // Mostrar la publicación
    const postContent = document.getElementById('post-content');
    const postElement = createPostElement(post);
    postContent.appendChild(postElement);

    // Obtener y mostrar los comentarios
  fetchComments(post.id);
  }

  function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    const titleElement = document.createElement('h2');
    titleElement.textContent = post.titulo;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = post.descripcion;

    const contentElement = document.createElement('p');
    contentElement.textContent = post.contenido;

    postElement.appendChild(titleElement);
    postElement.appendChild(descriptionElement);
    postElement.appendChild(contentElement);

    return postElement;
  }


  function getPostIdFromUrl() {
    // Obtener el valor del parámetro "id" de la URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }

  async function fetchComments(postId) {
    try {
      const commentsResponse = await fetch(`http://192.168.1.101:8080/api/publicacion/${postId}/comentarios`);
      const commentsData = await commentsResponse.json();
  
      // Mostrar los comentarios
      displayComments(commentsData);
    } catch (error) {
      console.error('Error al obtener los comentarios:', error);
    }
  }

  function displayComments(comments) {
    const commentsElement = document.createElement('div');
    commentsElement.classList.add('comments');
  
    const commentsTitle = document.createElement('h3');
    commentsTitle.textContent = 'Comentarios';
  
    commentsElement.appendChild(commentsTitle);
  
    if (comments.length > 0) {
      comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
      
        const commentContent = document.createElement('p');
        commentContent.textContent = comment.cuerpo;
      
        const commentUser = document.createElement('p');
        commentUser.textContent = `Usuario: ${comment.nombre || 'Anónimo'}`;
      
        // Crear botones de editar y eliminar
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');
      
        // Agregar texto a los botones
        editButton.textContent = 'Editar';
        deleteButton.textContent = 'Eliminar';
      
        // Agregar eventos de clic a los botones
        editButton.addEventListener('click', () => {
          const commentId = comment.id;
          const commentEmail = comment.email;
          const currentContent = comment.cuerpo;

          // Puedes reemplazar esto con un cuadro de diálogo o un formulario más sofisticado
          const newContent = prompt('Ingrese el nuevo contenido del comentario', currentContent);

          const data = {
            "nombre": comment.nombre,
            "email": comment.email,
            "cuerpo": newContent,
            "publicacion": comment.publicacion
          };

          if (newContent === null || newContent === '') {
            // El usuario canceló el cuadro de diálogo o ingresó un contenido vacío
            return;
          }

          const url = `http://192.168.1.101:8080/api/comentarios/${commentId}`;

          fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Asegúrate de que este es el formato correcto para tu API
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al editar el comentario');
            }
            commentContent.textContent = newContent; // Actualiza el contenido del comentario en el DOM
          })
          .catch(error => console.error('Error:', error));
        });
      
        deleteButton.addEventListener('click', () => {
          deleteComment(comment.id, commentElement);
        });
      
        // Crear un contenedor para los botones
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
      
        // Agregar los botones al contenedor
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
      
        commentElement.appendChild(commentUser);
        commentElement.appendChild(commentContent);
        // Agregar el contenedor de botones al comentario
        commentElement.appendChild(buttonContainer);
      
        commentsElement.appendChild(commentElement);
      });
    } else {
      const noCommentsMessage = document.createElement('p');
      noCommentsMessage.textContent = 'No hay comentarios aún.';
      commentsElement.appendChild(noCommentsMessage);
    }
  
    // Agregar los comentarios al DOM
    const postContent = document.getElementById('post-content');
    postContent.appendChild(commentsElement);
  }

  const createCommentButton = document.getElementById('createCommentButton');
  const commentFormContainer = document.getElementById('commentFormContainer');
  const commentForm = document.getElementById('commentForm');
  const commentContentInput = document.getElementById('commentContent');
  
  createCommentButton.addEventListener('click', () => {
    // Muestra el formulario cuando se hace clic en "Crear un comentario"
    commentFormContainer.style.display = 'block';
  });
  
  commentForm.addEventListener('submit', (event) => {
    event.preventDefault();
  
    // Aquí puedes enviar el comentario a tu API o realizar las acciones necesarias
    const commentContent = commentContentInput.value;
    sendComment(commentContent); // Envía el contenido del comentario
  
    // Puedes ocultar el formulario después de enviar el comentario si lo deseas
    commentFormContainer.style.display = 'none';
  
    // Aquí puedes agregar lógica para mostrar el comentario en la página si es necesario
  });
  
  function sendComment(cuerpo) {
    const postId = getPostIdFromUrl();
    const url = `http://192.168.1.101:8080/api/publicacion/${postId}/comentarios`;

    const data = {
      "nombre": "anonimo",
      "email": "anonimo",
      "cuerpo": cuerpo,
      "publicacion": postId
    };  
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      response.json();
      console.log(data);
    })
    .then(data => {
      location.reload();
    })
    .catch(error => console.error('Error:', error));
  }

  // Agregar el botón de eliminar al comentario
  commentElement.appendChild(deleteButton);



  function deleteComment(commentId, commentElement) {
    const url = `http://192.168.1.101:8080/api/comentarios/${commentId}`;

    fetch(url, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al eliminar el comentario');
      }
      console.log('Comentario eliminado'); // Para verificar que el comentario se está eliminando
      commentElement.remove(); // Elimina el comentario del DOM
    })
    .catch(error => console.error('Error:', error));
  }

  

  
});
