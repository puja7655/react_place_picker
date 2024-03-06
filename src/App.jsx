import { useEffect, useRef, useState } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js'

//I am using it outside the app function as i do not want to run it everytime rednering happens. It would save us performance
//even though it is a side effect , i am not putting it in useEffect as it run synchrnously and running it once in the render cycle would do the job
const storeIds = JSON.parse(localStorage.getItem('selectedPlaceForStorage')) || [];
const storedPlaces = storeIds.map((id) =>
  AVAILABLE_PLACES.find((place) => id === place.id)
);

function App() {
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [isModalOpen, setIsModalOPen] = useState(false)
  const [availablePlace, setAvailablePlaces] = useState([])


  useEffect(() => {
    //this would sortthe places based on distance from your locatin. A pop up would appear on the screen asking to access your current location 
    // and based on that it would sort all teh vailable places
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces)
    })
  }, [])

  function handleStartRemovePlace(id) {
    setIsModalOPen(true)
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsModalOPen(false)
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storeIds = JSON.parse(localStorage.getItem('selectedPlaceForStorage')) || []
    if (storeIds.indexOf(id) === -1) {
      localStorage.setItem('selectedPlaceForStorage', JSON.stringify([id, ...storeIds]))
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setIsModalOPen(false)
    const storeIds = JSON.parse(localStorage.getItem('selectedPlaceForStorage')) || []
    localStorage.setItem('selectedPlaceForStorage',
      JSON.stringify(storeIds.filter((id) => id !== selectedPlace.current)))
  }

  //prop onClose is added because dialog can also be closed by 'esc' key from keyboard in that case dialog would disappear but the state passed via prop (i.e isModalOpen state) will not be set to false
  //therefor modal can not be open again because the state value is still true- the UI is not in sync with state anymore
  return (
    <>
      <Modal open={isModalOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlace}
          fallbackText="Sorting places based on your current location ..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
