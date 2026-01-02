import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'

const Preview = () => {
  const { resumeId } = useParams()
  const [resumeData, setResumeData] = useState(null)

  const loadResume = () => {
    setResumeData(dummyResumeData.find(resume => resume._id === resumeId || null))
  }
  
  useEffect(() => {
    loadResume()
  }, [])
  return (
    <div>
      <h1>
        Preview Page
      </h1>
    </div>
  )
}

export default Preview