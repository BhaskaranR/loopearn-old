'use client'
import Cookies from 'js-cookie';

// check cookie for referral_code and show information that you have been referred

const ReferredSection = () => {
  const referralCode = Cookies.get('referral_code');

  if (!referralCode) {
    return null;
  }
  return (
    <div className="mb-4 rounded-md  p-4">
      <p className="text-sm text-gray-600">
        {`You've been referred to join us! Create your account now to start enjoying exclusive benefits.`}
      </p>
    </div>
  );
}


export default ReferredSection;
