/* ***** BEGIN LICENSE BLOCK *****
 * Version: GPL 3.0
 *
 * The contents of this file are subject to the General Public License
 * 3.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.gnu.org/licenses/gpl.html
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * Author: Michel Verbraak (info@1st-setup.nl)
 * Website: http://www.1st-setup.nl/
 *
 * This interface/service is used for loadBalancing Request to Exchange
 *
 * ***** BEGIN LICENSE BLOCK *****/

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;
var Cr = Components.results;
var components = Components;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

function mivExchangeRecurrenceInfo() {

	this._recurrenceInfo = Cc["@mozilla.org/calendar/recurrence-info;1"]
				.createInstance(Ci.calIRecurrenceInfo);

	this.globalFunctions = Cc["@1st-setup.nl/global/functions;1"]
				.getService(Ci.mivFunctions);

}

var PREF_MAINPART = 'extensions.1st-setup.exchangecalendar.recurrenceinfo.';

var mivExchangeRecurrenceInfoGUID = "d69c5580-8ff7-11e2-9e96-0800200c9a66";

mivExchangeRecurrenceInfo.prototype = {

	// methods from nsISupport

	_refCount: 0,

	//nsrefcnt AddRef();
	AddRef: function _AddRef()
	{
		this._refCount++;
		return this._refCount;
	},

	/* void QueryInterface(
	  in nsIIDRef uuid,
	  [iid_is(uuid),retval] out nsQIResult result
	);	 */
	QueryInterface: XPCOMUtils.generateQI([Ci.mivExchangeRecurrenceInfo,
						Ci.nsISupports,
						Ci.calIRecurrenceInfo,
						Ci.nsIClassInfo]),

	//nsrefcnt Release();
	Release: function _Release()
	{
		this._refCount--;
		return this._refCount;
	},

	// Attributes from nsIClassInfo

	classDescription: "RecurrenceInfo object for Exchange recurring master.",
	classID: components.ID("{"+mivExchangeRecurrenceInfoGUID+"}"),
	contractID: "@1st-setup.nl/exchange/recurrenceinfo;1",
	flags: Ci.nsIClassInfo.THREADSAFE,
	implementationLanguage: Ci.nsIProgrammingLanguage.JAVASCRIPT,

	// void getInterfaces(out PRUint32 count, [array, size_is(count), retval] out nsIIDPtr array);
	getInterfaces: function _getInterfaces(count) 
	{
		var ifaces = [Ci.mivExchangeRecurrenceInfo,
				Ci.nsISupports,
				Ci.calIRecurrenceInfo,
				Ci.nsIClassInfo];
		count.value = ifaces.length;
		return ifaces;
	},

	getHelperForLanguage: function _getHelperForLanguage(language) 
	{
		return null;
	},

	// External methods

	// Internal methods.
  // returns true if this thing is able to be modified;
  // if the item is not mutable, attempts to modify
  // any data will throw CAL_ERROR_ITEM_IS_IMMUTABLE
  //readonly attribute boolean isMutable;

	get isMutable()
	{
		return this._recurrenceInfo.isMutable;
	},

  // makes this item immutable
  //void makeImmutable();
	makeImmutable: function _makeImmutable()
	{
		return this._recurrenceInfo.makeImmutable();
	},

  // clone always returns a mutable event
  //calIRecurrenceInfo clone();
	clone: function _clone()
	{
		var result = Cc["@1st-setup.nl/exchange/recurrenceinfo;1"]
				.createInstance(Ci.mivExchangeRecurrenceInfo);

		result.item = this.item;
		var count = {};
		var myItems = this.getRecurrenceItems(count);
		result.setRecurrenceItems(count, myItems);
		return result;
	},

  // initialize this with the item for which this recurrence
  // applies, so that the start date can be tracked
  //attribute calIItemBase item;
	get item()
	{
		return this._recurrenceInfo.item;
	},

	set item(aValue)
	{
		this._recurrenceInfo.item = aValue;
	},

  /**
   * The start date of an item is directly referenced by parts of calIRecurrenceInfo,
   * thus changing the former without adjusting the latter would break the internal structure.
   * This method provides the necessary functionality. There's no need to call it manually
   * after writing to the start date of an item, since it's called automatically in the
   * appropriate setter of an item.
   */
  //void onStartDateChange(in calIDateTime aNewStartTime, in calIDateTime aOldStartTime);
	onStartDateChange: function _onStartDateChange(aNewStartTime, aOldStartTime)
	{
		this._recurrenceInfo.onStartDateChange(aNewStartTime, aOldStartTime);
	},

  /**
   * If the base item's UID changes, this implicitly has to change all overridden items' UID, too.
   *
   * @param id new UID 
   */
  //void onIdChange(in AUTF8String aNewId);
	onIdChange: function _onIdChange(aNewId)
	{
		this._recurrenceInfo.onIdChange(aNewId);
	},

  /*
   * Set of recurrence items; the order of these matters.
   */

  //void getRecurrenceItems(out unsigned long aCount, [array,size_is(aCount),retval] out calIRecurrenceItem aItems);
	getRecurrenceItems: function _getRecurrenceItems(aReturn)
	{
		return this._recurrenceInfo.getRecurrenceItems(aReturn);
	},
  //void setRecurrenceItems(in unsigned long aCount, [array,size_is(aCount)] in calIRecurrenceItem aItems);
	setRecurrenceItems: function _setRecurrenceItems(aCount, aItems)
	{
		this.logInfo("setRecurrenceItems.");
		this._recurrenceInfo.setRecurrenceItems(aCount, aItems);
	},

  //unsigned long countRecurrenceItems();
	countRecurrenceItems: function _countRecurrenceItems()
	{
		return this._recurrenceInfo.countRecurrenceItems();
	},

  //void clearRecurrenceItems();
	clearRecurrenceItems: function _clearRecurrenceItems()
	{
		this._recurrenceInfo.clearRecurrenceItems();
	},

  //void appendRecurrenceItem(in calIRecurrenceItem aItem);
	appendRecurrenceItem: function _appendRecurrenceItem(aItem)
	{
		this.logInfo("appendRecurrenceItem.");
		this._recurrenceInfo.appendRecurrenceItem(aItem);
	},

  //calIRecurrenceItem getRecurrenceItemAt(in unsigned long aIndex);
	getRecurrenceItemAt: function _getRecurrenceItemAt(aIndex)
	{
		this.logInfo("getRecurrenceItemAt: aIndex:"+aIndex);
		return this._recurrenceInfo.getRecurrenceItemAt(aIndex);
	},

  //void deleteRecurrenceItemAt(in unsigned long aIndex);
	deleteRecurrenceItemAt: function _deleteRecurrenceItemAt(aIndex)
	{
		this.logInfo("deleteRecurrenceItemAt: aIndex:"+aIndex);
		this._recurrenceInfo.deleteRecurrenceItemAt(aIndex);
	},

  //void deleteRecurrenceItem(in calIRecurrenceItem aItem);
	deleteRecurrenceItem: function _deleteRecurrenceItem(aItem)
	{
		this.logInfo("deleteRecurrenceItem.");
		this._recurrenceInfo.deleteRecurrenceItem(aItem);
	},

  // inserts the item at the given index, pushing the item that was previously there forward
  //void insertRecurrenceItemAt(in calIRecurrenceItem aItem, in unsigned long aIndex);
	insertRecurrenceItemAt: function _insertRecurrenceItemAt(aItem, aIndex)
	{
		this.logInfo("insertRecurrenceItemAt: aIndex:"+aIndex);
		this._recurrenceInfo.insertRecurrenceItemAt(aItem, aIndex);
	},


  /**
   * isFinite is true if the recurrence items specify a finite number
   * of occurrences.  This is useful for UI and for possibly other users.
   */
  //readonly attribute boolean isFinite;
	get isFinite()
	{
		return this._recurrenceInfo.isFinite;
	},

  /**
   * This is a shortcut to appending or removing a single negative date
   * assertion. aRecurrenceId needs to be a normal recurrence id, it may not be
   * RDATE.
   */
  //void removeOccurrenceAt(in calIDateTime aRecurrenceId);
	removeOccurrenceAt: function _removeOccurrenceAt(aRecurrenceId)
	{
		this.logInfo("removeOccurrenceAt: aRecurrenceId:"+aRecurrenceId);
		this.item.removeOccurrenceAt(aRecurrenceId);
		this._recurrenceInfo.removeOccurrenceAt(aRecurrenceId);
	},

  //void restoreOccurrenceAt(in calIDateTime aRecurrenceId);
	restoreOccurrenceAt: function _restoreOccurrenceAt(aRecurrenceId)
	{
		this.logInfo("restoreOccurrenceAt: aRecurrenceId:"+aRecurrenceId);
		this._recurrenceInfo.restoreOccurrenceAt(aRecurrenceId);
	},


  /*
   * exceptions
   */

  /**
   * Modify an a particular occurrence with the given exception proxy
   * item.  If the recurrenceId isn't an already existing exception item,
   * a new exception is added.  Otherwise, the existing exception
   * is modified.
   *
   * The item's parentItem must be equal to this RecurrenceInfo's
   * item. <-- XXX check this, compare by calendar/id only
   *
   * @param anItem exceptional/overridden item
   * @param aTakeOverOwnership whether the recurrence info object can take over
   *        the item or needs to clone it
   */
  //void modifyException(in calIItemBase anItem, in boolean aTakeOverOwnership);
	modifyException: function _modifyException(anItem, aTakeOverOwnership)
	{
		this.logInfo("modifyException: anItem:"+anItem.title);
		this._recurrenceInfo.modifyException(anItem, aTakeOverOwnership);
	},

  /**
   * Return an existing exception item for the given recurrence ID.
   * If an exception does not exist, null is returned.
   */
  //calIItemBase getExceptionFor(in calIDateTime aRecurrenceId);
	getExceptionFor: function _getExceptionFor(aRecurrenceId)
	{
		this.logInfo("getExceptionFor: aRecurrenceId:"+aRecurrenceId);
		return this._recurrenceInfo.getExceptionFor(aRecurrenceId);
	},

  /**
   * Removes an exception item for the given recurrence ID, if
   * any exist.
   */
  //void removeExceptionFor(in calIDateTime aRecurrenceId);
	removeExceptionFor: function _removeExceptionFor(aRecurrenceId)
	{
		this.logInfo("removeExceptionFor: aRecurrenceId:"+aRecurrenceId);
		this._recurrenceInfo.removeExceptionFor(aRecurrenceId);
	},

  /**
   * Returns a list of all recurrence ids that have exceptions.
   */
  //void getExceptionIds(out unsigned long aCount, [array,size_is(aCount),retval] out calIDateTime aIds);
	getExceptionIds: function _getExceptionIds(aValue)
	{
		return this._recurrenceInfo.getExceptionIds(aValue);
	},

  /*
   * Recurrence calculation
   */

  /*
   * Get the occurrence at the given recurrence ID; if there is no
   * exception, then create a new proxy object with the normal occurrence.
   * Otherwise, return the exception.
   *
   * @param aRecurrenceId   The recurrence ID to get the occurrence for.
   * @return                The occurrence or exception corresponding to the id
   */
  //calIItemBase getOccurrenceFor(in calIDateTime aRecurrenceId);
	getOccurrenceFor: function _getOccurrenceFor(aRecurrenceId)
	{
		return this._recurrenceInfo.getOccurrenceFor(aRecurrenceId);
	},

  /**
   * Return the chronologically next occurrence after aTime. This takes
   * exceptions and EXDATE/RDATEs into account.
   *
   * @param aTime           The (exclusive) date to start searching.
   * @return                The next occurrence, or null if there is none.
   */
  //calIItemBase getNextOccurrence(in calIDateTime aTime);
	getNextOccurrence: function _getNextOccurrence(aTime)
	{
		return this._recurrenceInfo.getNextOccurrence(aTime);
	},

  /**
   * Return the chronologically previous occurrence after aTime. This takes
   * exceptions and EXDATE/RDATEs into account.
   *
   * @param aTime           The (exclusive) date to start searching.
   * @return                The previous occurrence, or null if there is none.
   */
  //calIItemBase getPreviousOccurrence(in calIDateTime aTime);
	getPreviousOccurrence: function _getPreviousOccurrence(aTime)
	{
		return this._recurrenceInfo.getPreviousOccurrence(aTime);
	},

  /**
   * Return an array of calIDateTime representing all start times of this event
   * between start (inclusive) and end (non-inclusive). Exceptions are taken
   * into account.
   *
   * @param aRangeStart     The (inclusive) date to start searching.
   * @param aRangeEnd       The (exclusive) date to end searching.
   * @param aMaxCount       The maximum number of dates to return
   *
   * @param aCount          The number of dates returned.
   * @return                The array of dates.
   */
  //void getOccurrenceDates(in calIDateTime aRangeStart,
  //                        in calIDateTime aRangeEnd,
  //                        in unsigned long aMaxCount,
  //                        out unsigned long aCount, [array,size_is(aCount),retval] out calIDateTime aDates);
	getOccurrenceDates: function _getOccurrenceDates(aRangeStart, aRangeEnd, aMaxCount, aCount)
	{
		return this._recurrenceInfo.getOccurrenceDates(aRangeStart, aRangeEnd, aMaxCount, aCount);
	},

  /**
   * Return an array of calIItemBase representing all occurrences of this event
   * between start (inclusive) and end (non-inclusive). Exceptions are taken
   * into account.
   *
   * @param aRangeStart     The (inclusive) date to start searching.
   * @param aRangeEnd       The (exclusive) date to end searching.
   * @param aMaxCount       The maximum number of occurrences to return
   *
   * @param aCount          The number of occurrences returned.
   * @return                The array of occurrences.
   */
  //void getOccurrences(in calIDateTime aRangeStart,
  //                     in calIDateTime aRangeEnd,
  //                     in unsigned long aMaxCount,
  //                     out unsigned long aCount, [array,size_is(aCount),retval] out calIItemBase aItems);
	getOccurrences: function _getOccurrences(aRangeStart, aRangeEnd, aMaxCount, aCount)
	{
		return this._recurrenceInfo.getOccurrences(aRangeStart, aRangeEnd, aMaxCount, aCount);
	},

	logInfo: function _logInfo(message, aDebugLevel) {

		if (!aDebugLevel) {
			var debugLevel = 1;
		}
		else {
			var debugLevel = aDebugLevel;
		}

		this.storedDebugLevel = this.globalFunctions.safeGetIntPref(null, PREF_MAINPART+"debuglevel", 0, true);
		this.storedDebugLevel = 2;
		if (debugLevel <= this.storedDebugLevel) {
			this.globalFunctions.LOG("[exchangeRecurrenceInfo] "+message + " ("+this.globalFunctions.STACKshort()+")");
		}
	},

}

function NSGetFactory(cid) {

	try {
		if (!NSGetFactory.mivExchangeRecurrenceInfo) {
			// Load main script from lightning that we need.
			NSGetFactory.mivExchangeRecurrenceInfo = XPCOMUtils.generateNSGetFactory([mivExchangeRecurrenceInfo]);
	}

	} catch(e) {
		Components.utils.reportError(e);
		dump(e);
		throw e;
	}

	return NSGetFactory.mivExchangeRecurrenceInfo(cid);
} 

