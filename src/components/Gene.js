import React from 'react'
import Header from './Header'
import useDocumentTitle from './hooks/useDocumentTitle'
const Gene = () => {
  useDocumentTitle('Gene [bat-studio]')
  return (
    <div>
      <Header/>
      <h1>Gene</h1>
    </div>
  )
}

export default Gene
