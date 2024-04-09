import complaints from '@assets/icons/Alert/Triangle.svg';
import edited from '@assets/icons/Edit/Edit 1.svg';
import gps from '@assets/icons/Globe/Globe 1.svg';
import manual from '@assets/icons/Hand.svg';
import dupes from '@assets/icons/Layers.svg';
import import_delayed from '@assets/icons/Main/Clock.svg';
import stood from '@assets/icons/Main/During.svg';
import too_fast from '@assets/icons/Main/Speed.svg';
import alivebe from '@assets/icons/TrackerIcons/Alivebe.svg';
import appleHealth from '@assets/icons/TrackerIcons/Apple Health.svg';
import google from '@assets/icons/TrackerIcons/GoogleFit.svg';
import polar from '@assets/icons/TrackerIcons/Polar.svg';
import suunto from '@assets/icons/TrackerIcons/Redtriangle.svg';
import strava from '@assets/icons/TrackerIcons/Strava.svg';
import ios from '@assets/icons/OS/Apple.svg';
import android from '@assets/icons/OS/Android.svg';

export const ICON_MAP: Record<'trackers' | 'extra' | 'os', Record<string, string>> = {
  trackers: {
    alivebe,
    suunto,
    polar,
    ios: appleHealth,
    google,
    strava,
  },
  extra: {
    complaints,
    manual,
    too_fast,
    gps,
    stood,
    edited,
    dupes,
    import_delayed,
  },
  os: {
    ios,
    android,
  },
};
