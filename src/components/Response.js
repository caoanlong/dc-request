import styled from 'styled-components'

const ResStyle = styled.textarea`
    position: absolute;
    top: 30px;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    padding: 10px;
    line-height: 1.6;
    resize: none;
    outline: none;
    border: none;
`

const Response = ({ res }) => {
    return (
        <ResStyle value={res} readOnly={true}>
        </ResStyle>
    )
}

export default Response