import JSONEditor from 'jsoneditor'
import { useEffect, useRef } from 'react'

const ReqBody = ({ body, setBody }) => {
    const jsoneditor = useRef(null)
    let editor = null
    const options = {
        mainMenuBar: false,
        navigationBar: false,
        statusBar: false,
        limitDragging: false,
        mode: 'code',
        onValidate() {
            setBody(editor.get())
        }
    }
    
    useEffect(() => {
        editor = new JSONEditor(jsoneditor.current, options)
        editor.set(body)
    }, [])

    return (
        <div 
            ref={jsoneditor} 
            style={{width: '100%', height: '100%'}}>
        </div>
    )
}

export default ReqBody