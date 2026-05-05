import StravaGpxUploader from './components/StravaGpxUploader'
import './App.css'

function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
      {/* This renders the component you just created */}
      <StravaGpxUploader />
    </div>
  )
}

export default App;
