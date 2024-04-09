import { Activity } from '@model/activity';

export function getTrackExtraInfo(track: Activity) {
  return {
    haveComplains: track.track.flagged || track.track.complaintCount > 0,
    manualInput: track.extra.manual,
    tooFast: !!track.extra.too_fast,
    hasGps: track.extra.gps,
    importDelay: track.extra.import_delay,
    stood: track.standing.standing.stood,
    edited: track.extra.edited,
    hasDupes: track.track.has_dupes,
    checked: track.extra.checked,
  };
}
