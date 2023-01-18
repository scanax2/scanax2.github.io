import React from 'react'
import { BeatLoadingIndicator, LoadingIndicatorWrapper } from './GeneratorLoadingIndicatorElements'

const GeneratorLoadingIndicator = ({isLoading}) => {
    return (
        <>
            {(() => {
                if (isLoading) {
                    return (<LoadingIndicatorWrapper>
                                <BeatLoadingIndicator size={52} color="white"/>
                            </LoadingIndicatorWrapper>)
                } else {

                }
            })()}
        </>
    )
}

export default GeneratorLoadingIndicator
