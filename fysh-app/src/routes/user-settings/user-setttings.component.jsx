import { updateDocInCollection, storage, triggerPasswordReset } from "../../utils/firebase/firebase.utils";
import { ref, getDownloadURL, uploadString } from 'firebase/storage';

import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/user.context';
import { Toaster, toast } from 'react-hot-toast';
import Resizer from 'react-image-file-resizer';

const defaultFormFields = {
  displayName: '',
  bio: '',
  profilePicture: '',
}

const UserSettings = () => {
  const { currentUser, currentUserName, currentUserDoc, currentUserUID } = useContext(UserContext);
  const [ formFields, setFormFields ] = useState(defaultFormFields);
  const { displayName, bio } = formFields;

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedImage, setSelectedImage] = useState('');
  const [resizedImage, setResizedImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if(currentUserDoc && currentUserDoc.profilePicture) {
      setPreviewImage(currentUserDoc.profilePicture);
    }
    if(currentUserDoc){
      setFormFields({
        displayName: currentUserDoc.displayName,
        bio: currentUserDoc.bio,
        profilePicture: currentUserDoc.profilePicture,
      })
    }
  }, [currentUserDoc])

  useEffect(() => {
    if(!selectedImage && !currentUserDoc) {
        setPreviewImage(undefined);
        return;
    }
    if(selectedImage){
      const objectUrl = URL.createObjectURL(selectedImage);
      setPreviewImage(objectUrl);
    }
}, [selectedImage, currentUserDoc])

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(isUploading) {
      toast.error('Image is still uploading.');
      return;
    }
    else if(currentUserDoc){
            try{
                setIsSubmitting(true);
                await updateDocInCollection('users', currentUserUID, formFields);
                setIsSubmitting(false);
            } catch(err) {
                console.error(err);
            } finally {
              toast.success('Account updated successfully!');
            }
        }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!event.target.files || event.target.files.length === 0) {
        setSelectedImage(undefined);
        return;
    }
    if(file.size > (5 * 1024 * 1024)){
        toast.error('File must be less than 5MB.')
    } else {
        try{
            const uri = await resizeFile(file);
            setResizedImage(uri);
            setSelectedImage(file);
        } catch(err) {
            console.error(err);
        }
    }
  }

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error('Please choose a file before uploading.');
      return;
    }

    const newMetadata = {
      cacheControl: 'public,max-age=300',
      contentType: 'image/jpeg'
    };
    setIsUploading(true);
    const storageRef = ref(storage, `/users/${selectedImage.name}`);
    uploadString(storageRef, resizedImage, 'data_url', newMetadata).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((URL) => {
        setFormFields({ ...formFields, profilePicture: URL})
        setIsUploading(false);
      })
    }).catch((err) => console.error(err));
  }

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(file, 100, 100, 'jpeg', 100, 0, (uri) => {
        resolve(uri);
      });
  });

  return (
    <div className='lg:max-w-4xl lg:mt-20 mx-auto'>
      <Toaster/>
      <form onSubmit={handleSubmit}>
        <div className=" bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Account Settings</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and settings.</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <label className="text-sm font-medium text-gray-500">Full name</label>
                <input 
                placeholder={currentUser && currentUserName} 
                className="mt-1 p-1 rounded text-sm text-gray-900 sm:col-span-2 sm:mt-0"
                onChange={handleChange}
                name='displayName'
                value={displayName}
                />
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0">{currentUser && currentUser.email}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Password</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0">*************</dd>
                {currentUser &&
                  <button className='font-medium text-sm text-blue-600 hover:text-blue-500'
                  onClick={() => {triggerPasswordReset(currentUser.email); toast.success('Password reset email sent!');}}
                  >
                    Reset Your Password
                  </button>
                }
              </div>
              <div className="bg-white px-4 py-5 grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <label className="text-sm font-medium text-gray-500">Bio</label>
                <textarea placeholder={currentUserDoc && (currentUserDoc.bio ? currentUserDoc.bio : `I'm just a fysher!`)} onChange={handleChange} name='bio' value={bio} className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"/>
              </div>
              <div className="bg-gray-50 px-4 py-5 grid sm:grid-cols-3 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Profile Picture</dt>
                  <div className="w-full">
                    <div className="flex items-center justify-center w-full py-3 pl-3 pr-4 text-sm rounded-md border border-gray-200">
                      <div className="flex content-center flex-1 w-0 items-center">
                        <input onChange={handleFileChange} type='file' className="flex-1"/>
                      </div>
                    </div>
                      {selectedImage &&
                        <button type='button' onClick={handleUpload} className="mt-2 text-white bg-blue-600 hover:bg-blue-700 p-1 rounded flex-shrink-0">
                        Upload{isUploading ? 'ing...' : ''}
                      </button>
                      }
                  </div>
                <div className='mx-auto mt-5 sm:mt-0 justify-center border w-20 rounded-full'>
                  {previewImage &&
                    <img alt='Avatar preview' className='rounded-full' src={previewImage} />
                  }
                </div>
              </div>
            </dl>
          </div>
        </div>
        <div className="bg-white shadow rounded px-4 py-3 text-right sm:px-6">
          <button
            type="submit"
            className="sm:w-auto w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserSettings;