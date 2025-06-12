-- Users policies
CREATE POLICY "Users can view other users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- User actions policies
CREATE POLICY "Users can view own actions" ON user_actions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own actions" ON user_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Matches policies
CREATE POLICY "Users can view own matches" ON matches
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "System can create matches" ON matches
  FOR INSERT WITH CHECK (true);

-- Chats policies
CREATE POLICY "Users can view chats in their matches" ON chats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = chats.match_id 
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their matches" ON chats
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = match_id 
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update read status of messages" ON chats
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = chats.match_id 
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
    )
  );

-- Daily limits policies
CREATE POLICY "Users can view own daily limits" ON daily_limits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own daily limits" ON daily_limits
  FOR ALL USING (auth.uid() = user_id);
