import { Spin } from 'antd'
import React, { memo } from 'react'

const Loading: React.FC = () => {
    return (
        <div
            style={{
                display: 'flex',
                height: 'calc(100vh - 79px)',
                justifyContent: 'center',
            }}>
            <div style={{ alignContent: 'center', textAlign: 'center' }}>
                <Spin size='large' />
                <div style={{ marginTop: 10 }}>
                    <span>Đang tải...</span>
                </div>
            </div>
        </div>
    )
}

export default memo(Loading)
