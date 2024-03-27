import React from 'react'
import Header from './Header'
import useDocumentTitle from './hooks/useDocumentTitle'
import Footer from './Footer'
const PhenoTypeViewer = () => {
  useDocumentTitle('Phenotype Viewer [bat-studio]')
  return (
    <div>
      <Header/>
      <h1>PhenoTypeViewer</h1>
      <Footer/>
    </div>
  )
}

export default PhenoTypeViewer
