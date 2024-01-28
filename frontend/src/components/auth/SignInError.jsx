import React from 'react';
import { Alert, Space } from 'antd';

const SignInError = ({ onClose }) => (
  <Space
    direction="vertical"
    style={{
      width: '100%',
    }}
  >
    
    <Alert
      message={'ERROR'}
      description="Your email and/or password are incorrect. Please try again!"
      type="error"
      closable
      onClose={() => { onClose(); }}
      className="error-alert"
    />
  </Space>
);

export default SignInError;