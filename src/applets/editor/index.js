import React from 'react';
import { connect } from 'react-redux';
import FileDrop from 'react-file-drop';
import LoadingOverlay from 'react-loading-overlay';

import Editor from './editor/index';
import Controller from './controller/index';
import FileLoading from './file-loading';

import { MAX_FILE_SIZE_LIMIT_BYTES } from './constants';

let reader = new FileReader();
const EditorLoadingOverlay = (props) => <LoadingOverlay spinner={<FileLoading />} {...props} />

class Submit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentExt: props.ext[0],
            currentProblem: props.problems[0],
            value: '',

            // theming
            darkTheme: false,
            // file loading
            loading: false
        }

        this.catcherRef = React.createRef();
    }

    componentDidUpdate({ ext, problem }) {
        // reset all selections if data gets updated
        if ((this.props.ext !== ext) || (this.props.problem !== problem))
            this.setState({
                currentExt: this.props.ext[0],
                currentProblem: this.props.problems[0],
            })
    }

    processFile(file) {
        if (!(file instanceof Blob) && !(file instanceof File)) return;
        if (file.size > MAX_FILE_SIZE_LIMIT_BYTES) return;
            // TODO: raise error explicitly
        reader.onload = () => {
            this.setState({ value: reader.result, loading: false })
        };
        this.setState({ loading: true });
        reader.readAsText(file);
    }

    render() {
        const { currentExt, currentProblem, value, darkTheme, loading } = this.state;

        // rendering invisible input
        const upload = (
            <input
                type='file'
                onChange={({ target: { files } }) => this.processFile(files[0])}
                ref={this.catcherRef}
                style={{ display: 'none' /* invisible */ }}
                onClick={event => event.target.value = null}
            />
        )

        return (
            <>
                {upload}
                <Controller
                    onProblemChange={currentProblem => this.setState({ currentProblem })}
                    onExtChange={currentExt => this.setState({ currentExt })}
                    currentValues={{ ext: currentExt, problem: currentProblem }}
                    // no empty string submit
                    disableSubmit={!value}
                    getCode={() => value}
                    onLoadFile={() => this.catcherRef.current.click()}
                    fileLoading={loading}
                    cosmetic={{
                        onChangeTheme : () => this.setState({ darkTheme: !darkTheme }),
                        dark : darkTheme
                    }}
                    />
                <EditorLoadingOverlay active={loading}>
                    <FileDrop
                        onDrop={files => this.processFile(files[0])}>
                        <Editor
                            ext={`${currentExt}`.substr(1).toLowerCase()}
                            value={value}
                            theme={darkTheme ? 'dark' : 'light'}
                            onChange={(value) => { this.setState({ value }) }}/>
                    </FileDrop>
                </EditorLoadingOverlay>
            </>
        )
    }
}

const mapStateToProps = ({ contest: { ext, problems } }, props) => Object.assign({}, { ext, problems }, props)

export default connect(mapStateToProps)(Submit)
