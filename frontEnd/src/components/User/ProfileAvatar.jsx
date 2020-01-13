import React, { useContext } from 'react';
import { withRouter } from 'react-router';
import { IonButton, IonList, IonItem } from '@ionic/react';
import { AuthContext } from '../../contexts/authContext';
import axios from 'axios';

function ProfileAvatar(props) {
  const { user, setUser } = useContext(AuthContext);

  const signOut = async e => {
    setUser(null);
    axios.get('/api/users/logout');
    props.history.push('/requests');
  };

  console.log("USER PROFILE ", user);

  const userInfo = user => (
    <>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {/* <img src={user.picture.data.url} height={user.picture.height} width={user.picture.width} alt="avatar" /> */}
    </>
  );
  return (
    <>
      <IonList>{user ? userInfo(user) : ''}</IonList>
      <IonItem>
        <IonButton className="login-button" onClick={() => signOut()} expand="full" fill="solid" color="danger">
          Logout from Facebook
        </IonButton>
      </IonItem>
    </>
  );
}

export default withRouter(ProfileAvatar);