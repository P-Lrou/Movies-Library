"use strict"


//TODO *****************************/
//TODO ** Variable Initialisation **/
//TODO *****************************/

//#region Variable Initialisation
let online = false
let moviesApiStock = null
let categoriesApiStock = null
let details = document.querySelector('.details')
let tempEdit = null
let tempDelete = null
let adult = false
let moviesSection = document.querySelector('.movies')
let limit = null
let maxMovie = 12
if (window.matchMedia("(width < 600px)").matches) {
    maxMovie = 6
}
let distance = 0
//#endregion

//TODO *****************************/
//TODO *****************************/
//TODO *****************************/


//! ********************************/
//! ******** Initialisation ********/
//! ********************************/

//#region Initialisation
const startPage = () => {
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault()
    })
    let age = document.getElementById('ageInput').value
    if (age.length === 0) {
        return
    }
    if (age >= 18) {
        adult = true
        apiChoice()
    }
    if (age < 18) {
        adult = false
        apiChoice()
    }
}

const apiChoice = () => {
    let modeName = document.querySelector('.modeName')
    if (online) {
        console.log('ONLINE')
        modeName.innerHTML = 'Online'
        apiOnline()
    }
    if (!online) {
        console.log('OFFLINE')
        modeName.innerHTML = 'Offline'
        apiLocal()
    }
}

const apiOnline = () => {
    fetch('https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies')
        .then(res => res.json())
        .then(val => {
            moviesApiStock = val
            createMovies(moviesApiStock)
        })
    fetch('https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/categories')
        .then(res => res.json())
        .then(val => categoriesApiStock = val)
}

const apiLocal = () => {
    moviesApiStock = moviesApiLocalStock
    categoriesApiStock = categoriesApiLocalStock
    if (!localStorage.getItem(`moviesApiStock`)) {
        localStorage.setItem(`moviesApiStock`, JSON.stringify(moviesApiStock))
    }
    if (!localStorage.getItem(`categoriesApiStock`)) {
        localStorage.setItem(`categoriesApiStock`, JSON.stringify(categoriesApiStock))
    }
    moviesApiStock = JSON.parse(localStorage.getItem(`moviesApiStock`))
    categoriesApiStock = JSON.parse(localStorage.getItem(`categoriesApiStock`))
    createMovies(moviesApiStock)
}

const createMovies = (ActualMovies) => {
    let moviesHTML = document.querySelector('.movies')
    let newSection = document.createElement('div')
    let i = 0
    if (!online) {
        localStorage.setItem(`moviesApiStock`, JSON.stringify(moviesApiStock))
        localStorage.setItem(`categoriesApiStock`, JSON.stringify(categoriesApiStock))
        moviesApiStock = JSON.parse(localStorage.getItem(`moviesApiStock`))
        categoriesApiStock = JSON.parse(localStorage.getItem(`categoriesApiStock`))
    }
    document.querySelector('.static').style.display = "block"
    document.querySelector('.movies').style.display = "flex"
    document.querySelector('.details').style.display = "none"
    document.querySelector('.overlayFilterCategories').style.display = "none"
    document.querySelector('.overlayCreate').style.display = "none"
    document.querySelector('.overlayCreateCategorie').style.display = "none"
    document.querySelector('.overlayEditCategorie').style.display = "none"
    document.querySelector('.overlayNoResult').style.display = "none"
    document.querySelector('.overlayDeleteCategories').style.display = "none"
    setTimeout(() => {
        gsap.to(".start", { y: -1000, duration: 2 });
    }, 1000);
    setTimeout(() => {
        document.querySelector('.start').style.display = "none"
    }, 3000);
    reset()
    gsap.to(".movies", { x: `0vw`, duration: 1 });
    if (distance === 0) {
        document.querySelector('#arrowLeft').style.display = "none"
        document.querySelector('#arrowRigth').style.display = "block"
    }
    newSection.classList.add("section");
    moviesHTML.appendChild(newSection)
    sectionCreation(ActualMovies, i)
    document.querySelector('#number').innerHTML = ActualMovies.length
    document.querySelector('.movies').style.animation = "arrivedMovies 1s"
    limit = - document.querySelectorAll('.section').length
    if (limit === -1) {
        document.querySelector('#arrowRigth').style.display = "none"
    }
    changeInfo(ActualMovies)
}

const reset = () => {
    document.querySelector('.movies').innerHTML = ''
    limit = 0
    distance = 0
}

const sectionCreation = (tab_temp, i) => {
    for (let v = 0; v < tab_temp.length; v++) {
        i++
        let tempSection = document.querySelectorAll('.section')
        let actualSection = tempSection[tempSection.length - 1]
        let newElt = document.createElement('div')
        newElt.classList.add("movie");
        newElt.setAttribute('id', tab_temp[v].id);
        newElt.style.backgroundImage = `url(${tab_temp[v].img})`;
        if (adult === false && tab_temp[v].category === "R7njrf6DPHVvNRLpz4P0") {
            newElt.style.backgroundImage = `url(https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMGNhdHxlbnwwfHwwfHw%3D&w=1000&q=80)`
        }
        actualSection.appendChild(newElt)
        if (i === maxMovie) {
            i = 0
            let newSection = document.createElement('div')
            newSection.classList.add("section");
            moviesSection.appendChild(newSection)
        }
    }
}
//#endregion

//! ********************************/
//! ********************************/
//! ********************************/


//? ********************************/
//? ******** Change Movies *********/
//? ********************************/

//#region Change Movies
const changeInfo = (ActualMovies) => {
    let movie_title = document.querySelector('.movie_title')
    let description = document.querySelector('.description')
    let author = document.querySelector('.author')
    let category = document.querySelector('.category')
    let dislikes = document.querySelector('.dislikes')
    let likes = document.querySelector('.likes')
    let images = document.querySelector('.images')
    let iframe = document.querySelector('iframe')
    let movie = document.querySelectorAll('.movie')
    let ratio = document.querySelector('.ratio')
    movie.forEach(element => {
        element.addEventListener("click", () => {
            details.style.display = "block"
            gsap.from(".details", { x: 2500, duration: 0.5 });
            document.querySelector('.movies').style.animation = "departMovies 1s"
            document.querySelector('#arrowLeft').style.display = "none"
            document.querySelector('#arrowRigth').style.display = "none"
            setTimeout(() => {
                document.querySelector('.movies').style.display = "none"
            }, 1000);
            ActualMovies.forEach(e => {
                if (e.id === element.id) {
                    let likesButton = document.querySelector('#likeSVG')
                    let dislikesButton = document.querySelector('#dislikeSVG')
                    movie_title.innerHTML = e.name;
                    description.innerHTML = e.description;
                    author.innerHTML = e.author;
                    category.innerHTML = setCategoriesID(e.category);
                    iframe.src = urlEmbed(e.video)
                    if (adult === false && e.category === "R7njrf6DPHVvNRLpz4P0") {
                        iframe.src = urlEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
                    }
                    dislikes.innerHTML = e.dislikes;
                    likes.innerHTML = e.likes;
                    ratio.innerHTML = numberRatio(e.likes, e.dislikes) + '%'
                    images.style.backgroundImage = `url(${e.img})`
                    if (adult === false && e.category === "R7njrf6DPHVvNRLpz4P0") {
                        images.style.backgroundImage = `url(https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMGNhdHxlbnwwfHwwfHw%3D&w=1000&q=80)`
                    }
                    if (online) {
                        likesButton.addEventListener("click", () => {
                            if (!localStorage.getItem(`${e.id}+like`) && !localStorage.getItem(`${e.id}+dislike`)) {
                                let url = 'https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies/' + e.id + '/like';
                                axios.patch(url)
                                    .then(() => {
                                        likes.innerHTML = e.likes + 1;
                                        fetch('https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies/' + e.id)
                                            .then(res => res.json())
                                            .then(val => {
                                                let toto = moviesApiStock.findIndex(elm => elm.id === val.id)
                                                moviesApiStock[toto] = val
                                            })
                                    })
                            }
                            localStorage.setItem(`${e.id}+like`, 'true')
                        })
                        dislikesButton.addEventListener("click", () => {
                            if (!localStorage.getItem(`${e.id}+like`) && !localStorage.getItem(`${e.id}+dislike`)) {
                                let url = 'https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies/' + e.id + '/dislike';
                                axios.patch(url)
                                    .then(() => {
                                        dislikes.innerHTML = e.dislikes + 1;
                                        fetch('https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies/' + e.id)
                                            .then(res => res.json())
                                            .then(val => {
                                                let toto = moviesApiStock.findIndex(elm => elm.id === val.id)
                                                moviesApiStock[toto] = val
                                            })
                                    })
                            }
                            localStorage.setItem(`${e.id}+dislike`, 'true')
                        })
                    }
                    if (!online) {
                        likesButton.addEventListener("click", () => {
                            if (!localStorage.getItem(`${e.id}+like`) && !localStorage.getItem(`${e.id}+dislike`)) {
                                likes.innerHTML = e.likes + 1;
                                let toto = moviesApiStock.findIndex(elm => elm.id === e.id)
                                moviesApiStock[toto].likes += 1
                            }
                            localStorage.setItem(`${e.id}+like`, 'true')
                            localStorage.setItem(`moviesApiStock`, JSON.stringify(moviesApiStock))
                            localStorage.setItem(`categoriesApiStock`, JSON.stringify(categoriesApiStock))
                            moviesApiStock = JSON.parse(localStorage.getItem(`moviesApiStock`))
                            categoriesApiStock = JSON.parse(localStorage.getItem(`categoriesApiStock`))
                        })
                        dislikesButton.addEventListener("click", () => {
                            if (!localStorage.getItem(`${e.id}+like`) && !localStorage.getItem(`${e.id}+dislike`)) {
                                dislikes.innerHTML = e.dislikes + 1;
                                let toto = moviesApiStock.findIndex(elm => elm.id === e.id)
                                moviesApiStock[toto].dislikes += 1
                            }
                            localStorage.setItem(`${e.id}+dislike`, 'true')
                            localStorage.setItem(`moviesApiStock`, JSON.stringify(moviesApiStock))
                            localStorage.setItem(`categoriesApiStock`, JSON.stringify(categoriesApiStock))
                            moviesApiStock = JSON.parse(localStorage.getItem(`moviesApiStock`))
                            categoriesApiStock = JSON.parse(localStorage.getItem(`categoriesApiStock`))
                        })
                    }
                    let button_modal = document.querySelector(".button_modal")
                    let overlay = document.querySelector(".overlay")
                    editInfo(e)
                    tempDelete = e
                    button_modal.addEventListener("click", () => {
                        overlay.style.display = "block"
                    })
                }
            })
        })
    })
}

const numberRatio = (like, dislike) => {
    if (like > dislike) {
        return (Math.floor((like / (like + dislike)) * 100))
    }
    if (like < dislike) {
        return (-Math.floor((like / (like + dislike)) * 100))
    }
    if (like === dislike) {
        return 0
    }
}

const setCategoriesID = (e) => {
    let categoryID = null
    categoriesApiStock.map(elm => {
        if (e === elm.id) {
            categoryID = elm.name
        }
    })
    return (categoryID)
}

const setCategoriesNAME = (e) => {
    let categoryNAME = null
    categoriesApiStock.map(elm => {
        if (e === elm.name) {
            categoryNAME = elm.id
        }
    })
    return (categoryNAME)
}

const urlEmbed = (i) => {
    let newUrl = i.slice(i.length - 11, i.length);
    return "https://www.youtube.com/embed/" + newUrl;
}

const closeInfo = () => {
    let cross = document.querySelector('.cross')
    cross.addEventListener('click', () => {
        gsap.to(".details", { x: 2500, duration: 0.5 });
        document.querySelector('.movies').style.animation = "arrivedMovies 1s"
        document.querySelector('.movies').style.display = "flex"
        document.querySelector('#arrowLeft').style.display = "block"
        document.querySelector('#arrowRigth').style.display = "block"
        if (distance === 0) {
            document.querySelector('#arrowLeft').style.display = "none"
        }
        if (limit === -1) {
            document.querySelector('#arrowRigth').style.display = "none"
        }
        if (distance - 100 === limit * 100) {
            document.querySelector('#arrowRigth').style.display = "none"
        }
        setTimeout(() => {
            details.style.display = "none"
            gsap.to(".details", { x: 0, duration: 0.5 });
        }, 100);
        createMovies(moviesApiStock)
    })
}

const editInfo = (e) => {
    let overlay = document.querySelector(".overlay")
    let modal = document.querySelector(".modal")
    let cross2 = document.querySelector(".cross2")

    cross2.addEventListener("click", () => {
        overlay.style.display = "none"
    })

    modal.addEventListener("click", (event) => {
        event.stopPropagation();
    })


    document.querySelector('#modalName').value = `${e.name}`
    document.querySelector('#modalAuthor').value = `${e.author}`
    document.querySelector('#modalDescription').value = `${e.description}`
    CategoriesEditDetails(e.category)
    document.querySelector('#modalVideo').value = `${e.video}`
    document.querySelector('#modalImage').value = `${e.img}`

    tempEdit = e
}

const editInfoOnClick = () => {
    let e = tempEdit
    let overlay = document.querySelector('.overlay')
    let val = document.querySelector('#edit')
    let formData = new FormData(val);
    let name = formData.get("modalName")
    let author = formData.get("modalAuthor")
    let img = formData.get("modalImage")
    let category = formData.get("modalCategory")
    let description = formData.get("modalDescription")
    let video = formData.get("modalVideo")
    if (name.length === 0 || author.length === 0 || img.length === 0 || description.length === 0 || video.length === 0) {
        alert('Veuillez renseignez tout les champs')
        return;
    }
    if (online) {
        let url = 'https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies/' + e.id;
        axios.patch(url, {
            name: `${name}`,
            author: `${author}`,
            img: `${img}`,
            category: `${setCategoriesNAME(category)}`,
            description: `${description}`,
            video: `${video}`
        })
            .then(() => {
                fetch(`${url}`)
                    .then(res => res.json())
                    .then(val => {
                        let toto = moviesApiStock.findIndex(elm => elm.id === val.id)
                        moviesApiStock[toto] = val
                        createMovies(moviesApiStock)
                        details.style.display = "none"
                        overlay.style.display = "none"
                    })
            })
        return;
    }
    if (!online) {
        let toto = moviesApiStock.findIndex(elm => elm.id === e.id)
        moviesApiStock[toto].name = name
        moviesApiStock[toto].author = author
        moviesApiStock[toto].img = img
        moviesApiStock[toto].category = setCategoriesNAME(category)
        moviesApiStock[toto].description = description
        moviesApiStock[toto].video = video
        createMovies(moviesApiStock)
        details.style.display = "none"
        overlay.style.display = "none"
    }

}

const deleteMovie = () => {
    let overlayDelete = document.querySelector('.overlayDelete')
    overlayDelete.style.display = "block"
}

const deleteMovieYes = () => {
    let e = tempDelete
    let overlayDelete = document.querySelector('.overlayDelete')
    if (online) {
        let url = 'https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies/' + e.id;
        axios.delete(url)
            .then(() => {
                fetch(`https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies`)
                    .then(res => res.json())
                    .then(val => {
                        moviesApiStock = val
                        details.style.display = "none"
                        overlayDelete.style.display = "none"
                        createMovies(moviesApiStock)
                    })
            })
    }
    if (!online) {
        let toto = moviesApiStock.findIndex(elm => elm.id === e.id)
        for (let i = 0; i < moviesApiStock.length; i++) {
            if (moviesApiStock[i] === moviesApiStock[toto]) {
                moviesApiStock.splice(i, 1);
            }
        }
        details.style.display = "none"
        overlayDelete.style.display = "none"
        createMovies(moviesApiStock)
    }

}

const deleteMovieNo = () => {
    createMovies(moviesApiStock)
    let overlayDelete = document.querySelector('.overlayDelete')
    overlayDelete.style.display = "none"
}

const CategoriesEditDetails = (actualCategory) => {
    let modalCategory = document.querySelector('#modalCategory')
    modalCategory.innerHTML = ''
    modalCategory.innerHTML = '<option class="select" selected></option>'
    categoriesApiStock.map(e => {
        if (e.id !== actualCategory) {
            let newElt = document.createElement('option')
            newElt.innerHTML = setCategoriesID(e.id)
            modalCategory.appendChild(newElt)
        }
        if (e.id === actualCategory) {
            let select = document.querySelector('.select')
            select.innerHTML = setCategoriesID(e.id)
        }
    })

}
//#endregion

//? ********************************/
//? ********************************/
//? ********************************/


//TODO *****************************/
//TODO *********** Filter **********/
//TODO *****************************/

//#region Filter
const searchFunction = () => {
    document.querySelector('.movies').style.display = "grid"
    let stock = []
    let searchForm = document.querySelector('#searchForm')
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault()
    });
    const formData = new FormData(searchForm);
    let search = formData.get('search')
    moviesApiStock.filter(movie => {
        if (movie.name.toUpperCase().includes(search.toUpperCase()) || movie.author.toUpperCase().includes(search.toUpperCase()) || movie.description.toUpperCase().includes(search.toUpperCase())) {
            stock.push(movie)
        }
    })
    if (search.length > 0 && stock.length === 0) {
        document.querySelector('.overlayNoResult').style.display = "block"
        document.querySelector('#arrowLeft').style.display = "none"
        document.querySelector('#arrowRigth').style.display = "none"
        document.querySelector('.movies').style.display = "none"
        return
    }
    if (search.length === 0) {
        stock = moviesApiStock
    }
    createMovies(stock)
}

const yesadd = () => {
    document.querySelector('.overlayCreate').style.display = "block"
    document.querySelector('.overlayNoResult').style.display = "none"
}

const noadd = () => {
    createMovies(moviesApiStock)
}

const sortAZ = () => {
    let stock = []
    let final = [] =
        moviesApiStock.filter(movie => {
            stock.push(movie.name)
            stock.sort()
        })
    stock.map(e => {
        moviesApiStock.map(elm => {
            if (e === elm.name) {
                final.push(elm)
            }
        })
    })
    createMovies(final)
}

const sortZA = () => {
    let stock = []
    let final = [] =
        moviesApiStock.filter(movie => {
            stock.push(movie.name)
            stock.sort()
        })
    stock.map(e => {
        moviesApiStock.map(elm => {
            if (e === elm.name) {
                final.unshift(elm)
            }
        })
    })
    createMovies(final)
}

const sortCategories = () => {
    let overlayFilterCategories = document.querySelector('.overlayFilterCategories')
    let crossFilterCategories = document.querySelector('.crossFilterCategories')
    overlayFilterCategories.style.display = "block"
    crossFilterCategories.addEventListener('click', () => {
        overlayFilterCategories.style.display = 'none'
        createMovies(moviesApiStock)
    })
    CategoriesEditSort()
}

const CategoriesEditSort = () => {
    let choiceFilterCategories = document.querySelector('#choiceFilterCategories')
    choiceFilterCategories.innerHTML = ''
    choiceFilterCategories.innerHTML = '<option class="selectFilter" selected></option>'
    let i = 0
    categoriesApiStock.map(e => {
        if (i === 0) {
            let selectFilter = document.querySelector('.selectFilter');
            selectFilter.innerHTML = setCategoriesID(e.id);
        }
        if (i > 0) {
            let newElt = document.createElement('option')
            newElt.innerHTML = setCategoriesID(e.id)
            choiceFilterCategories.appendChild(newElt)
        }
        i++
    })
}

const sortCategoriesOnClick = () => {
    let stock = []
    let actualCategory = document.getElementById('choiceFilterCategories').value
    moviesApiStock.map(e => {
        if (e.category === setCategoriesNAME(actualCategory)) {
            stock.push(e)
        }
    })
    createMovies(stock)
}

const deleteCategories = () => {
    let overlayDeleteCategories = document.querySelector('.overlayDeleteCategories')
    overlayDeleteCategories.style.display = "block"
    document.querySelector('.crossDeleteCategories').addEventListener('click', () => {
        overlayDeleteCategories.style.display = 'none'
        createMovies(moviesApiStock)
    })
    CategoriesDeleteEdit()
}

const CategoriesDeleteEdit = () => {
    let choiceDeleteCategories = document.querySelector('#choiceDeleteCategories')
    choiceDeleteCategories.innerHTML = ''
    choiceDeleteCategories.innerHTML = '<option class="selectDelete" selected></option>'
    let i = 0
    let stock = []
    let final = []
    categoriesApiStock.map(e => {
        moviesApiStock.map(elm => {
            if (elm.category === e.id) {
                stock.push(e.id)
            }
        })
    })
    categoriesApiStock.map(e => {
        if (stock.includes(e.id)) {
            return
        }
        else {
            final.push(e)
        }
    })
    final.map(e => {
        if (i === 0) {
            let selectDelete = document.querySelector('.selectDelete');
            selectDelete.innerHTML = setCategoriesID(e.id);
        }
        if (i > 0) {
            let newElt = document.createElement('option')
            newElt.innerHTML = setCategoriesID(e.id)
            choiceDeleteCategories.appendChild(newElt)
        }
        i++
    })
}

const deleteCategoriesOnClick = () => {
    let actualCategory = document.getElementById('choiceDeleteCategories').value
    if (online) {
        let url = 'https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/categories/' + setCategoriesNAME(actualCategory);
        axios.delete(url)
            .then(() => {
                fetch(`https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/categories`)
                    .then(res => res.json())
                    .then(val => {
                        categoriesApiStock = val
                        createMovies(moviesApiStock)
                    })
            })
    }
    if (!online) {
        let toto = categoriesApiStock.findIndex(elm => elm.id === setCategoriesNAME(actualCategory))
        for (let i = 0; i < categoriesApiStock.length; i++) {
            if (categoriesApiStock[i] === categoriesApiStock[toto]) {
                categoriesApiStock.splice(i, 1);
            }
        }
        createMovies(moviesApiStock)
    }
}

const sortLikes = () => {
    let stock = [...moviesApiStock]
    stock.sort(
        (p1, p2) => {
            return (p1.likes < p2.likes) ? 1 : (p1.likes > p2.likes) ? -1 : 0;
        });
    createMovies(stock)
}

const sortDislikes = () => {
    let stock = [...moviesApiStock]
    stock.sort(
        (p1, p2) => {
            return (p1.dislikes < p2.dislikes) ? 1 : (p1.dislikes > p2.dislikes) ? -1 : 0;
        });
    createMovies(stock)
}

//#endregion

//TODO *****************************/
//TODO *****************************/
//TODO *****************************/


//! ********************************/
//! ******* Create New Movie *******/
//! ********************************/

//#region Create New Movie
const CreateMovie = () => {
    let overlayCreate = document.querySelector('.overlayCreate')
    let crossCreate = document.querySelector('.crossCreate')
    crossCreate.addEventListener('click', () => {
        overlayCreate.style.display = 'none'
        createMovies(moviesApiStock)
    })
    CategoriesCreate()
    overlayCreate.style.display = 'block'
}

const CreateMovieOnClick = () => {
    let val = document.querySelector('#Create')
    let overlayCreate = document.querySelector('.overlayCreate')
    let formData = new FormData(val);
    let name = formData.get("modalNameCreate")
    let author = formData.get("modalAuthorCreate")
    let img = formData.get("modalImageCreate")
    let category = formData.get("modalCategoryCreate")
    let description = formData.get("modalDescriptionCreate")
    let video = formData.get("modalVideoCreate")
    if (name.length === 0 || author.length === 0 || img.length === 0 || description.length === 0 || video.length === 0) {
        alert('Veuillez renseignez tout les champs')
        return;
    }
    if (online) {
        let url = 'https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies';
        axios.post(url, {
            name: `${name}`,
            author: `${author}`,
            img: `${img}`,
            category: `${setCategoriesNAME(category)}`,
            description: `${description}`,
            video: `${video}`
        })
            .then(() => {
                fetch(`https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/movies`)
                    .then(res => res.json())
                    .then(val => {
                        moviesApiStock = val
                        document.querySelector('.movies').style.animation = "arrivedMovies 1s"
                        overlayCreate.style.display = "none"
                        createMovies(moviesApiStock)
                    })
            })
        return;
    }
    if (!online) {
        let newMovie = {
            "id": "",
            "name": "",
            "category": "",
            "likes": 0,
            "video": "",
            "img": "",
            "dislikes": 0,
            "author": "",
            "description": ""
        }
        newMovie.id = newID()
        newMovie.name = name
        newMovie.category = setCategoriesNAME(category)
        newMovie.video = video
        newMovie.img = img
        newMovie.author = author
        newMovie.description = description
        moviesApiStock.push(newMovie)
        overlayCreate.style.display = "none"
        createMovies(moviesApiStock)
    }
}

const newID = () => {
    let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let ID = ''
    for (let i = 0; i < 20; i++) {
        let newElmt = Math.floor(Math.random() * characters.length);
        ID += characters[newElmt]
    }
    moviesApiStock.map(e => {
        if (e.id === ID) {
            newID()
            return;
        }
    })
    categoriesApiStock.map(e => {
        if (e.id === ID) {
            newID()
            return;
        }
    })
    return ID
}

const CategoriesCreate = () => {
    let modalCategoryCreate = document.querySelector('#modalCategoryCreate')
    modalCategoryCreate.innerHTML = ''
    modalCategoryCreate.innerHTML = '<option class="selectCreate" selected></option>'
    let i = 0
    categoriesApiStock.map(e => {
        if (i === 0) {
            let selectCreate = document.querySelector('.selectCreate');
            selectCreate.innerHTML = setCategoriesID(e.id);
        }
        if (i > 0) {
            let newElt = document.createElement('option')
            newElt.innerHTML = setCategoriesID(e.id)
            modalCategoryCreate.appendChild(newElt)
        }
        i++
    })

}
//#endregion

//! ********************************/
//! ********************************/
//! ********************************/


//? ********************************/
//? ***** Create New Categorie *****/
//? ********************************/

//#region Create New Categorie
const CreateCategorie = () => {
    let overlayCreateCategorie = document.querySelector('.overlayCreateCategorie')
    let crossCreateCategorie = document.querySelector('.crossCreateCategorie')
    crossCreateCategorie.addEventListener('click', () => {
        overlayCreateCategorie.style.display = 'none'
    })
    overlayCreateCategorie.style.display = 'block'
}

const CreateCategorieOnClick = () => {
    let overlayCreateCategorie = document.querySelector('.overlayCreateCategorie')
    let nameCategorie = document.getElementById("modalNameCreateCategorie").value
    if (nameCategorie.length === 0) {
        alert('Veuillez renseignez tout les champs')
        return;
    }
    if (online) {
        let url = 'https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/categories';
        axios.post(url, {
            name: `${nameCategorie}`
        })
            .then(() => {
                fetch(`https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/categories`)
                    .then(res => res.json())
                    .then(val => {
                        categoriesApiStock = val
                        document.querySelector('.movies').style.animation = "arrivedMovies 1s"
                        overlayCreateCategorie.style.display = "none"
                        createMovies(moviesApiStock)
                    })
            })
        return;
    }
    if (!online) {
        let newCategories = {
            "id": "",
            "name": ""
        }
        newCategories.id = newID()
        newCategories.name = nameCategorie
        categoriesApiStock.push(newCategories)
        overlayCreateCategorie.style.display = "none"
        createMovies(moviesApiStock)
    }
}
//#endregion

//? ********************************/
//? ********************************/
//? ********************************/


//TODO *****************************/
//TODO ******* Edit Categorie ******/
//TODO *****************************/

//#region Edit Categorie
const EditCategorie = () => {
    let overlayEditCategorie = document.querySelector('.overlayEditCategorie')
    let crossEditCategorie = document.querySelector('.crossEditCategorie')
    crossEditCategorie.addEventListener('click', () => {
        overlayEditCategorie.style.display = 'none'
    })
    CategoriesEditCreate()
    overlayEditCategorie.style.display = 'block'
}

const EditCategorieOnClick = () => {
    let overlayEditCategorie = document.querySelector('.overlayEditCategorie')
    let NameEditCategorie = document.getElementById("modalNameEditCategorie").value
    let modalCategories = document.getElementById('modalCategories').value
    if (NameEditCategorie.length === 0) {
        alert('Veuillez renseignez tout les champs')
        return;
    }
    if (online) {
        let url = 'https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/categories/' + setCategoriesNAME(modalCategories);
        axios.put(url, {
            name: `${NameEditCategorie}`
        })
            .then(() => {
                fetch(`https://europe-west3-gobelins-9079b.cloudfunctions.net/api/v1/categories`)
                    .then(res => res.json())
                    .then(val => {
                        categoriesApiStock = val
                        document.querySelector('.movies').style.animation = "arrivedMovies 1s"
                        overlayEditCategorie.style.display = "none"
                        createMovies(moviesApiStock)
                    })
            })
        return;
    }
    if (!online) {
        let toto = categoriesApiStock.findIndex(elm => elm.id === setCategoriesNAME(modalCategories))
        categoriesApiStock[toto].name = NameEditCategorie
        overlayEditCategorie.style.display = "none"
        createMovies(moviesApiStock)
    }
}

const CategoriesEditCreate = () => {
    let modalCategories = document.querySelector('#modalCategories')
    modalCategories.innerHTML = ''
    modalCategories.innerHTML = '<option class="selectCreate" selected></option>'
    let i = 0
    categoriesApiStock.map(e => {
        if (i === 0) {
            let selectCreate = document.querySelector('.selectCreate');
            selectCreate.innerHTML = setCategoriesID(e.id);
        }
        if (i > 0) {
            let newElt = document.createElement('option')
            newElt.innerHTML = setCategoriesID(e.id)
            modalCategories.appendChild(newElt)
        }
        i++
    })

}
//#endregion

//TODO *****************************/
//TODO *****************************/
//TODO *****************************/


//! ********************************/
//! ********** Switch Mode *********/
//! ********************************/

//#region Switch Mode
const switchMode = () => {
    if (online === true) {
        online = false
        apiChoice()
    }
    else {
        online = true
        apiChoice()
    }
}
//#endregion

//! ********************************/
//! ********************************/
//! ********************************/


//? ********************************/
//? ************ Arrows ************/
//? ********************************/

//#region Arrows
document.querySelector('#arrowRigth').addEventListener('click', () => {
    distance = distance - 100
    gsap.to(".movies", { x: `${distance}vw`, duration: 1 });
    if (distance < 0) {
        document.querySelector('#arrowLeft').style.display = "block"
    }
    if (distance - 100 === limit * 100) {
        document.querySelector('#arrowRigth').style.display = "none"
    }
})

document.querySelector('#arrowLeft').addEventListener('click', () => {
    distance = distance + 100
    gsap.to(".movies", { x: `${distance}vw`, duration: 1 });
    console.log(distance)
    if (distance === 0) {
        document.querySelector('#arrowLeft').style.display = "none"
    }
    if (distance - 100 > limit * 100) {
        document.querySelector('#arrowRigth').style.display = "block"
    }
})
//#endregion

//? ********************************/
//? ********************************/
//? ********************************/