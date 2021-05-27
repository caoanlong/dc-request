import styled from 'styled-components'

const InputStyle = styled.input`
    width: 100%;
    padding: 0 5px;
    border: 1px solid #ddd;
    outline: none;
`

const Params = () => {
    return (
        <div style={{padding: '0 10px'}}>
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <InputStyle type="text" />
                        </td>
                        <td>
                            <InputStyle type="text" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Params